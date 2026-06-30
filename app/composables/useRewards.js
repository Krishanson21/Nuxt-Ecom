export function getRewardUserKey() {
  if (!process.client) return null

  let session = null
  try {
    session = JSON.parse(localStorage.getItem('active_user_session') || 'null')
  } catch (error) {
    session = null
  }
  if (session?.userId) return `user:${session.userId}`
  if (session?.email || session?.emailOrPhone) return `user:${session.email || session.emailOrPhone}`

  let deviceId = localStorage.getItem('anon_store_device_id')
  if (!deviceId) {
    const randomId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()
    deviceId = `dev_${randomId}`
    localStorage.setItem('anon_store_device_id', deviceId)
  }

  return `device:${deviceId}`
}

const emptySummary = () => ({
  totalPoints: 0,
  tier: 'Bronze',
  nextTier: 'Silver',
  nextTierAt: 1000,
  progressToNextTier: 0,
  weeklyStreak: 0,
  dailyCheckInClaimedToday: false,
  recentRewards: [],
  rewardHistory: []
})

export function useRewards() {
  const rewardSummary = useState('reward-summary', emptySummary)
  const isRewardsLoading = useState('is-rewards-loading', () => false)
  const isAwardingReward = useState('is-awarding-reward', () => false)
  const rewardError = useState('reward-error', () => '')

  async function fetchRewards() {
    if (!process.client) return rewardSummary.value
    const userKey = getRewardUserKey()
    if (!userKey) return rewardSummary.value

    isRewardsLoading.value = true
    rewardError.value = ''

    try {
      rewardSummary.value = await $fetch('/api/rewards', {
        headers: { 'x-user-key': userKey }
      })
    } catch (error) {
      rewardError.value = 'Unable to load rewards.'
    } finally {
      isRewardsLoading.value = false
    }

    return rewardSummary.value
  }

  async function awardReward(action, metadata = {}) {
    if (!process.client) return null
    const userKey = getRewardUserKey()
    if (!userKey) return null

    isAwardingReward.value = true
    rewardError.value = ''

    try {
      const result = await $fetch('/api/rewards', {
        method: 'POST',
        headers: { 'x-user-key': userKey },
        body: { action, metadata }
      })

      if (result?.summary) rewardSummary.value = result.summary
      return result
    } catch (error) {
      rewardError.value = 'Unable to update rewards.'
      return null
    } finally {
      isAwardingReward.value = false
    }
  }

  return {
    rewardSummary,
    isRewardsLoading,
    isAwardingReward,
    rewardError,
    fetchRewards,
    awardReward
  }
}
