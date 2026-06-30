<template>
  <main class="container account-page-main">
    <div class="account-header-row">
      <div class="breadcrumb-trail">
        <NuxtLink to="/" active-class="active">Home</NuxtLink> <span>/</span> <p>My Account</p>
      </div>
      <p class="welcome-text" v-if="userProfile.name">
        Welcome! <span class="highlight-red">{{ userProfile.name }}</span>
      </p>
    </div>

    <div class="account-dashboard-layout">
      <aside class="account-navigation-sidebar">
        <div class="nav-group">
          <h3>Manage My Account</h3>
          <ul>
            <li><NuxtLink to="/account" class="active-sidebar-link">My Profile / Details</NuxtLink></li>
            <li><NuxtLink to="/wishlist">My Wishlist</NuxtLink></li>
            <li><NuxtLink to="/cart">My Shopping Cart</NuxtLink></li>
            <li>
              <button class="btn-sidebar-logout-action" @click="handleDashboardLogout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout Account
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div class="account-content-stack">
        <section class="rewards-summary-panel" aria-labelledby="rewards-heading" :aria-busy="isRewardsLoading">
          <div class="rewards-panel-header">
            <div>
              <p class="rewards-kicker">Exclusive Rewards</p>
              <h2 id="rewards-heading">{{ rewardSummary.tier }} Member</h2>
            </div>
            <button
              type="button"
              class="btn-outline-small"
              :disabled="isDailyCheckInDisabled"
              @click="claimDailyCheckIn"
            >
              {{ dailyCheckInButtonLabel }}
            </button>
          </div>

          <p v-if="isRewardsLoading" class="rewards-status-copy">Loading rewards...</p>
          <p v-if="rewardError" class="rewards-error-copy">{{ rewardError }}</p>
          <p v-if="dailyCheckInMessage" class="rewards-status-copy">{{ dailyCheckInMessage }}</p>

          <div class="rewards-stats-grid">
            <div class="reward-stat">
              <span class="reward-stat-value">{{ rewardSummary.totalPoints }}</span>
              <span class="reward-stat-label">Points</span>
            </div>
            <div class="reward-stat">
              <span class="reward-stat-value">{{ rewardSummary.weeklyStreak }}</span>
              <span class="reward-stat-label">Week streak</span>
            </div>
            <div class="reward-stat">
              <span class="reward-stat-value">{{ rewardSummary.nextTier || 'Max' }}</span>
              <span class="reward-stat-label">Next tier</span>
            </div>
          </div>

          <div class="tier-progress-track" aria-label="Tier progress">
            <span :style="{ width: `${rewardSummary.progressToNextTier}%` }"></span>
          </div>

          <div class="recent-rewards-list">
            <div class="rewards-list-header">
              <h3>Reward history</h3>
              <button
                v-if="rewardHistory.length > 4"
                type="button"
                class="history-toggle-btn"
                @click="showFullHistory = !showFullHistory"
              >
                {{ showFullHistory ? 'Show less' : 'View all' }}
              </button>
            </div>
            <p v-if="rewardHistory.length === 0" class="empty-rewards-copy">
              Earn points by checking out, saving products, and completing your profile.
            </p>
            <div v-for="reward in visibleRewards" :key="reward.id" class="recent-reward-row">
              <span>
                {{ reward.label }}
                <small>{{ formatRewardDate(reward.createdAt) }}</small>
              </span>
              <strong>{{ reward.points > 0 ? '+' : '' }}{{ reward.points }}</strong>
            </div>
          </div>
        </section>

        <section class="account-profile-card">
          <h2>Account Details</h2>

          <form @submit.prevent="saveProfileChanges">
            <div class="form-row-split">
              <div class="form-input-group">
                <label for="first-name">First Name</label>
                <input id="first-name" type="text" v-model="userProfile.firstName" required />
              </div>
              <div class="form-input-group">
                <label for="last-name">Last Name</label>
                <input id="last-name" type="text" v-model="userProfile.lastName" required />
              </div>
            </div>
            <div class="form-row-split">
              <div class="form-input-group">
                <label for="profile-email">Email Address</label>
                <input id="profile-email" type="email" v-model="userProfile.email" required />
              </div>
              <div class="form-input-group">
                <label for="profile-phone">Phone Number</label>
                <input id="profile-phone" type="tel" v-model="userProfile.phone" placeholder="No phone saved" />
              </div>
            </div>

            <div class="password-changes-section">
              <label>Update Password</label>
              <div class="form-input-group full-width-input">
                <input type="password" v-model="passwordState.current" placeholder="Current Password" />
              </div>
              <div class="form-input-group full-width-input">
                <input type="password" v-model="passwordState.new" placeholder="New Password" />
              </div>
              <div class="form-input-group full-width-input">
                <input type="password" v-model="passwordState.confirm" placeholder="Confirm New Password" />
              </div>
            </div>

            <div class="form-actions-footer">
              <button type="button" class="btn-cancel-flat" @click="resetFormToData">Cancel</button>
              <button type="submit" class="btn-red" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
            <p v-if="saveSuccess" class="success-log-alert">Profile updated successfully!</p>
          </form>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRewards } from '~/composables/useRewards'

const routerInstance = useRouter()
const isSaving = ref(false)
const saveSuccess = ref(false)
const showFullHistory = ref(false)
const dailyCheckInMessage = ref('')
const {
  rewardSummary,
  isRewardsLoading,
  isAwardingReward,
  rewardError,
  fetchRewards,
  awardReward
} = useRewards()

const userProfile = ref({
  name: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const passwordState = ref({
  current: '',
  new: '',
  confirm: ''
})

const rewardHistory = computed(() => rewardSummary.value.rewardHistory || rewardSummary.value.recentRewards || [])
const visibleRewards = computed(() => showFullHistory.value ? rewardHistory.value : rewardHistory.value.slice(0, 4))
const isDailyCheckInDisabled = computed(
  () => isRewardsLoading.value || isAwardingReward.value || rewardSummary.value.dailyCheckInClaimedToday
)
const dailyCheckInButtonLabel = computed(() => {
  if (isAwardingReward.value) return 'Claiming...'
  if (rewardSummary.value.dailyCheckInClaimedToday) return 'Claimed Today'
  return 'Daily Check-in'
})

function loadSessionData() {
  if (process.client) {
    const session = localStorage.getItem('active_user_session')
    if (session) {
      const parsedUser = JSON.parse(session)
      const namesArray = parsedUser.name ? parsedUser.name.split(' ') : ['User', '']

      userProfile.value = {
        name: parsedUser.name || 'User',
        firstName: namesArray[0],
        lastName: namesArray.slice(1).join(' ') || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || ''
      }
    } else {
      userProfile.value = {
        name: 'Md Rimel',
        firstName: 'Md',
        lastName: 'Rimel',
        email: 'rimel1111@gmail.com',
        phone: '+8801511122'
      }
    }
  }
}

function resetFormToData() {
  loadSessionData()
  passwordState.value = { current: '', new: '', confirm: '' }
}

function saveProfileChanges() {
  isSaving.value = true
  saveSuccess.value = false

  setTimeout(() => {
    isSaving.value = false
    saveSuccess.value = true
    userProfile.value.name = `${userProfile.value.firstName} ${userProfile.value.lastName}`

    if (process.client) {
      const existingSession = JSON.parse(localStorage.getItem('active_user_session') || '{}')
      localStorage.setItem('active_user_session', JSON.stringify({
        userId: existingSession.userId,
        name: userProfile.value.name,
        emailOrPhone: userProfile.value.email || existingSession.emailOrPhone,
        email: userProfile.value.email,
        phone: userProfile.value.phone
      }))
    }

    const isProfileComplete = Boolean(userProfile.value.firstName && userProfile.value.lastName && userProfile.value.email && userProfile.value.phone)
    if (isProfileComplete) {
      awardReward('profile_completed', { source: 'account_profile' })
    }

    passwordState.value = { current: '', new: '', confirm: '' }
    setTimeout(() => { saveSuccess.value = false }, 4000)
  }, 1000)
}

function handleDashboardLogout() {
  if (process.client) {
    localStorage.removeItem('active_user_session')
  }
  const loginState = useState('isLoggedIn')
  if (loginState) loginState.value = false

  routerInstance.push('/')
  if (process.client) setTimeout(() => window.location.reload(), 100)
}

async function claimDailyCheckIn() {
  dailyCheckInMessage.value = ''
  const result = await awardReward('daily_check_in', { claimedAt: new Date().toISOString() })

  if (result?.skipped) {
    dailyCheckInMessage.value = 'Daily check-in already claimed today.'
    return
  }

  if (result?.awarded) {
    dailyCheckInMessage.value = `Daily check-in claimed. You earned ${result.awarded} points.`
  }
}

function formatRewardDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

onMounted(() => {
  loadSessionData()
  fetchRewards()
})
</script>

<style scoped>
@import '~/assets/css/account.css';

.btn-sidebar-logout-action {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #7d7d7d;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s ease;
    text-align: left;
    margin-top: 10px;
}
.btn-sidebar-logout-action:hover {
    color: #db4444;
}
.btn-sidebar-logout-action i {
    font-size: 13px;
}
</style>
