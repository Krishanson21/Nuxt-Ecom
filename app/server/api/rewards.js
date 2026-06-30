import { connectToDatabase } from '../utils/db'
import {
  calculateWeeklyStreak,
  resolvePoints,
  resolveTier,
  startOfToday,
  validateRewardPayload
} from '../utils/rewardRules'

async function buildSummary(rewardsCollection, userKey) {
  const recentEntries = await rewardsCollection
    .find({ userKey })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray()

  const allEntries = await rewardsCollection.find({ userKey }).sort({ createdAt: -1 }).toArray()
  const totalPoints = allEntries.reduce((sum, entry) => sum + Number(entry.points || 0), 0)
  const tier = resolveTier(totalPoints)
  const progressToNextTier = tier.nextTierAt
    ? Math.min(100, Math.round((totalPoints / tier.nextTierAt) * 100))
    : 100
  const todayStart = startOfToday()
  const dailyCheckInClaimedToday = allEntries.some(
    (entry) => entry.action === 'daily_check_in' && new Date(entry.createdAt) >= todayStart
  )

  const mapReward = (entry) => ({
    id: String(entry._id),
    action: entry.action,
    label: entry.label,
    points: entry.points,
    createdAt: entry.createdAt,
    metadata: entry.metadata || {}
  })

  return {
    totalPoints,
    tier: tier.name,
    nextTier: tier.nextTier,
    nextTierAt: tier.nextTierAt,
    progressToNextTier,
    weeklyStreak: calculateWeeklyStreak(allEntries),
    dailyCheckInClaimedToday,
    recentRewards: recentEntries.map(mapReward),
    rewardHistory: allEntries.map(mapReward)
  }
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const query = getQuery(event)
  const userKey = getHeader(event, 'x-user-key') || query.userKey

  if (!userKey) {
    setResponseStatus(event, 400)
    return { error: 'User identity missing' }
  }

  const { db } = await connectToDatabase()
  const rewardsCollection = db.collection('reward_ledger')

  if (method === 'GET') {
    return buildSummary(rewardsCollection, userKey)
  }

  if (method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method not allowed' }
  }

  const validation = validateRewardPayload(await readBody(event))
  if (!validation.ok) {
    setResponseStatus(event, validation.statusCode)
    return { error: validation.error }
  }
  const { action, metadata, rule } = validation

  const duplicateQuery = { userKey, action }
  if (rule.once) {
    const existing = await rewardsCollection.findOne(duplicateQuery)
    if (existing) return { skipped: true, summary: await buildSummary(rewardsCollection, userKey) }
  }

  if (rule.uniqueBy) {
    const existing = await rewardsCollection.findOne({
      ...duplicateQuery,
      [`metadata.${rule.uniqueBy}`]: metadata[rule.uniqueBy]
    })
    if (existing) return { skipped: true, summary: await buildSummary(rewardsCollection, userKey) }
  }

  if (rule.oncePerDay) {
    const existing = await rewardsCollection.findOne({
      ...duplicateQuery,
      createdAt: { $gte: startOfToday() }
    })
    if (existing) return { skipped: true, summary: await buildSummary(rewardsCollection, userKey) }
  }

  const entry = {
    userKey,
    action,
    label: rule.label,
    points: resolvePoints(rule, metadata),
    metadata,
    createdAt: new Date()
  }

  await rewardsCollection.insertOne(entry)

  return {
    success: true,
    awarded: entry.points,
    summary: await buildSummary(rewardsCollection, userKey)
  }
})
