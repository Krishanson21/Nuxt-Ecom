<template>
  <main class="container cart-page" id="main-content">
    <nav aria-label="Breadcrumb" class="breadcrumb">
      <ol style="list-style: none; display: flex; gap: 8px; padding: 0;">
        <li>
          <NuxtLink to="/">Home</NuxtLink> /
        </li>
        <li><span aria-current="page" class="active">Cart</span></li>
      </ol>
    </nav>

    <h1 class="sr-only">Your Shopping Cart</h1>

    <div v-if="cart.length === 0" class="empty-cart" role="region" aria-live="polite">
      <p>Your cart is empty.</p>
      <NuxtLink to="/" class="btn-red inline-block">Return To Shop</NuxtLink>
    </div>

    <div v-else>
      <div role="table" aria-label="Shopping Cart Contents" class="cart-table-wrapper">
        <div role="row" class="cart-table-header">
          <div role="columnheader">Product</div>
          <div role="columnheader">Price</div>
          <div role="columnheader">Quantity</div>
          <div role="columnheader">Subtotal</div>
        </div>

        <div role="row" v-for="item in cart" :key="item.id" class="cart-row">
          <div role="cell" class="product-cell">
            <button class="remove-btn" @click="removeItem(item.id)"
              :aria-label="`Remove ${item.name || item.title} from cart`">x</button>
            <img v-if="item.image" :src="item.image" :alt="item.name || item.title" class="cart-product-image" />
            <span v-else class="product-thumb" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.name || item.title }}</span>
          </div>
          <div role="cell">${{ item.price }}</div>
          <div role="cell">
            <label :for="`qty-${item.id}`" class="sr-only">Quantity for {{ item.name || item.title }}</label>
            <input :id="`qty-${item.id}`" type="number" v-model.number="item.quantity" min="1" class="qty-input" />
          </div>
          <div role="cell">${{ item.price * item.quantity }}</div>
        </div>
      </div>

      <div class="cart-page container">
        <div class="cart-actions-row">
          <NuxtLink to="/" class="btn-outline">
            Return To Shop
          </NuxtLink>

          <button type="button" class="btn-outline" @click="updateCart">
            Update Cart
          </button>
        </div>
      </div>
      <div class="cart-bottom-blocks">
        <div class="coupon-box" role="search" aria-label="Coupon Entry">
          <label for="coupon-input" class="sr-only">Coupon Code</label>
          <input id="coupon-input" type="text" placeholder="Coupon Code" />
          <button class="btn-red">Apply Coupon</button>
        </div>

        <div class="totals-card" role="region" aria-label="Order summary status">
          <h3>Cart Total</h3>
          <div class="total-line"><span>Subtotal:</span> <span>${{ subtotal }}</span></div>
          <div class="total-line"><span>Shipping:</span> <span>Free</span></div>
          <div class="total-line grand"><span>Total:</span> <span>${{ subtotal }}</span></div>
          <div class="center-btn">
            <button class="btn-red" :disabled="isCheckingOut" @click="completeCheckout">
              {{ isCheckingOut ? 'Processing...' : 'Proceed to checkout' }}
            </button>
          </div>
          <p v-if="checkoutMessage" class="checkout-message">{{ checkoutMessage }}</p>
          <p v-if="checkoutError" class="checkout-error">{{ checkoutError }}</p>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartSync } from '~/composables/useCartSync'
import { getRewardUserKey, useRewards } from '~/composables/useRewards'
const cart = useState('cart', () => [])
const subtotal = computed(() => cart.value.reduce((total, item) => total + (item.price * item.quantity), 0))
function removeItem(id) { cart.value = cart.value.filter(item => item.id !== id) }
const isCheckingOut = ref(false)
const checkoutMessage = ref('')
const checkoutError = ref('')
const { awardReward } = useRewards()

const { fetchCartFromDB, syncCartToDB, initializeDeviceSession, isCartLoaded } = useCartSync()

function updateCart() {
  cart.value = cart.value
    .filter(item => Number(item.quantity) > 0)
    .map(item => ({ ...item, quantity: Math.max(1, Number(item.quantity || 1)) }))
  if (process.client) localStorage.setItem('user_shopping_cart', JSON.stringify(cart.value))
  syncCartToDB()
}

async function completeCheckout() {
  if (cart.value.length === 0 || isCheckingOut.value) return

  isCheckingOut.value = true
  checkoutMessage.value = ''
  checkoutError.value = ''

  try {
    const order = await $fetch('/api/orders', {
      method: 'POST',
      headers: { 'x-user-key': getRewardUserKey() },
      body: { items: cart.value }
    })

    await awardReward('purchase', {
      orderId: order.orderId,
      orderTotal: order.orderTotal
    })

    cart.value = []
    if (process.client) localStorage.setItem('user_shopping_cart', JSON.stringify([]))
    await syncCartToDB()
    checkoutMessage.value = `Order complete. You earned ${Math.floor(order.orderTotal)} reward points.`
  } catch (error) {
    checkoutError.value = 'Checkout could not be completed. Please try again.'
  } finally {
    isCheckingOut.value = false
  }
}

watch(cart, () => {
  if (isCartLoaded.value) {
    syncCartToDB()
  }
}, { deep: true })

onMounted(() => {
  initializeDeviceSession()
  fetchCartFromDB()
})
</script>

<style scoped>
@import '~/assets/css/cart.css';
</style>
