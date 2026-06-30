export const REWARD_RULES = {
  purchase: {
    label: 'Purchase completed',
    points: (metadata) => Math.max(1, Math.floor(Number(metadata.orderTotal))),
    uniqueBy: 'orderId',
    requiredMetadata: ['orderId', 'orderTotal']
  },
  profile_completed: {
    label: 'Profile completed',
    points: 150,
    once: true
  },
  wishlist_add: {
    label: 'Product saved to wishlist',
    points: 10,
    uniqueBy: 'productId',
    requiredMetadata: ['productId']
  },
  daily_check_in: {
    label: 'Daily check-in',
    points: 25,
    oncePerDay: true
  }
}

export function resolvePoints(rule, metadata) {
  return typeof rule.points === 'function' ? rule.points(metadata) : rule.points
}

export function resolveTier(points) {
  if (points >= 5000) return { name: 'Platinum', nextTier: null, nextTierAt: null }
  if (points >= 2500) return { name: 'Gold', nextTier: 'Platinum', nextTierAt: 5000 }
  if (points >= 1000) return { name: 'Silver', nextTier: 'Gold', nextTierAt: 2500 }
  return { name: 'Bronze', nextTier: 'Silver', nextTierAt: 1000 }
}

export function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export function calculateWeeklyStreak(entries, now = new Date()) {
  const engagementWeeks = new Set(
    entries
      .filter((entry) => ['purchase', 'daily_check_in'].includes(entry.action))
      .map((entry) => {
        const date = new Date(entry.createdAt)
        const weekStart = new Date(date)
        weekStart.setHours(0, 0, 0, 0)
        weekStart.setDate(date.getDate() - date.getDay())
        return weekStart.toISOString().slice(0, 10)
      })
  )

  let streak = 0
  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() - cursor.getDay())

  while (engagementWeeks.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 7)
  }

  return streak
}

export function validateRewardPayload(body = {}) {
  const action = body.action
  const metadata = isPlainObject(body.metadata) ? body.metadata : {}
  const rule = REWARD_RULES[action]

  if (!rule) {
    return { ok: false, statusCode: 400, error: 'Unknown reward action' }
  }

  const missingField = (rule.requiredMetadata || []).find((field) => !hasValue(metadata[field]))
  if (missingField) {
    return {
      ok: false,
      statusCode: 400,
      error: `Missing reward metadata: ${missingField}`
    }
  }

  if (action === 'purchase' && !isPositiveNumber(metadata.orderTotal)) {
    return { ok: false, statusCode: 400, error: 'Purchase order total must be greater than zero' }
  }

  return { ok: true, action, metadata, rule }
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== ''
}

function isPositiveNumber(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue > 0
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
