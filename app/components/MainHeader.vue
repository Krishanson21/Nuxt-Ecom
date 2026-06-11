<template>
  <div>
    <div class="top-banner" role="complementary" aria-label="Announcement Bar">
      <p>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <a href="#">ShopNow</a></p>
      <label for="lang-selector" class="sr-only">Select Language</label>
      <select id="lang-selector" class="lang-select">
        <option>English</option>
      </select>
    </div>

    <header class="main-header">
      <div class="header-container">
        <NuxtLink to="/" class="logo" aria-label="Exclusive E-Commerce Home">Exclusive</NuxtLink>
        <nav class="nav-links" aria-label="Main Navigation">
          <NuxtLink to="/" active-class="active">Home</NuxtLink>
          <NuxtLink to="/contact" active-class="active">Contact</NuxtLink>
          <NuxtLink to="/about" active-class="active">About</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/signup" class="signup-nav-btn" active-class="active">Sign Up</NuxtLink>
        </nav>

        <div class="header-actions">
          <div class="search-box">
            <label for="global-search" class="sr-only">Search Products</label>
            <SearchBar />
            <button class="search-submit-btn" @click="handleSearchSubmit" aria-label="Submit search query">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </button>
          </div>
          <button class="icon-btn-clear" aria-label="View Wishlist">
            <i class="fa-regular fa-heart" aria-hidden="true"></i>
          </button>
          <NuxtLink to="/cart" class="cart-icon-wrapper" :aria-label="`Shopping Cart, ${cartCount} items`">
            <img src="/images/cart.png" alt="Shopping Cart" class="navbar-cart-img" />
            <span v-if="cartCount > 0" class="cart-badge" aria-hidden="true">{{ cartCount }}</span>
          </NuxtLink>
          <div v-if="isLoggedIn" class="account-menu" v-click-outside="closeDropdown">
            <button 
              class="account-circle-btn" 
              :class="{ 'btn-highlight': isDropdownOpen }"
              @click="isDropdownOpen = !isDropdownOpen" 
              aria-label="Open User Account Options"
            >
              <img src="/images/avatar.png" alt="login-avatar" class="avatar-img">
            </button>

            <div class="profile-floating-menu" v-if="isDropdownOpen">
              <NuxtLink to="/account" @click="closeDropdown">
                <i class="fa-regular fa-user" aria-hidden="true"></i> Manage My Account
              </NuxtLink>
              
              <NuxtLink to="/account/orders" @click="closeDropdown">
                <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> My Orders
              </NuxtLink>

              <NuxtLink to="/cart" @click="closeDropdown">
                <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> My Cart
              </NuxtLink>

              <hr class="dropdown-divider" />
              
              <button class="btn-dropdown-logout" @click="handleLogoutAction">
                <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const cart = useState('cart', () => [])
const cartCount = computed(() => cart.value.reduce((acc, item) => acc + item.quantity, 0))

const isLoggedIn = ref(false)
const currentUser = ref(null)

const isDropdownOpen = ref(false)

function closeDropdown() {
  isDropdownOpen.value = false
}

function handleLogoutAction() {
  isLoggedIn.value = false
  isDropdownOpen.value = false
  currentUser.value = null
  
  if (process.client) {
    localStorage.removeItem('active_user_session')
  }
  routerInstance.push('/')
}

onMounted(() => {
  if (process.client) {
    const session = localStorage.getItem('active_user_session')
    if (session) {
      isLoggedIn.value = true
      currentUser.value = JSON.parse(session)
    }
  }
})

import { useRouter } from 'vue-router'

const routerInstance = useRouter()

const searchQuery = ref('')

function handleSearchSubmit() {
  const cleanQuery = searchQuery.value.trim()
  if (!cleanQuery) return
  routerInstance.push(`/products?search=${encodeURIComponent(cleanQuery.toLowerCase())}`)
  
  searchQuery.value = ''
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
@import '~/assets/css/header.css';
</style>