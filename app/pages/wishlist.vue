<template>
  <main class="container wishlist-page" style="padding-top: 60px; padding-bottom: 80px; min-height: 85vh;">
    
    <div class="wishlist-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
      <h1 style="font-size: 20px; font-weight: 500; margin: 0;">Wishlist ({{ wishlist.length }})</h1>
      <button v-if="wishlist.length > 0" class="btn-outline" @click="moveAllToCart">Move All To Bag</button>
    </div>

    <div v-if="wishlist.length > 0" class="products-grid">
      <ProductCard 
        v-for="item in wishlist" 
        :key="item.id" 
        :product="item" 
        @add-to-cart="pushToCart"
        @add-to-wishlist="removeFromWishlist"
      />
    </div>

    <div v-else style="text-align: center; padding: 80px 20px;">
      <i class="fa-regular fa-heart" style="font-size: 48px; color: #7d7d7d; margin-bottom: 16px;"></i>
      <h2 style="font-size: 24px; font-weight: 500; margin-bottom: 12px;">Your wishlist is empty</h2>
      <p style="color: #7d7d7d; margin-bottom: 24px;">Tap the heart icon on any product to save items here.</p>
      <NuxtLink to="/products" class="btn-red">Continue Shopping</NuxtLink>
    </div>

  </main>
</template>

<script setup>
import { onMounted } from 'vue'

const wishlist = useState('wishlist', () => [])
const cart = useState('cart', () => [])

function removeFromWishlist(product) {
  wishlist.value = wishlist.value.filter(item => item.id !== product.id)
  if (process.client) {
    localStorage.setItem('user_wishlist', JSON.stringify(wishlist.value))
  }
}

function pushToCart(incomingProduct) {
  const matchedItem = cart.value.find(item => item.id === incomingProduct.id)
  if (matchedItem) {
    matchedItem.quantity++
  } else {
    cart.value.push({ ...incomingProduct, quantity: 1 })
  }
  if (process.client) {
    localStorage.setItem('user_shopping_cart', JSON.stringify(cart.value))
  }
}

function moveAllToCart() {
  wishlist.value.forEach(product => {
    pushToCart(product)
  })
  wishlist.value = []
  if (process.client) {
    localStorage.setItem('user_wishlist', JSON.stringify([]))
  }
}

onMounted(() => {
  if (process.client) {
    try {
      const savedWishlist = localStorage.getItem('user_wishlist')
      if (savedWishlist) wishlist.value = JSON.parse(savedWishlist)
      
      const savedCart = localStorage.getItem('user_shopping_cart')
      if (savedCart) cart.value = JSON.parse(savedCart)
    } catch (e) {}
  }
})
</script>

<style scoped>
@import '~/assets/css/index.css';

.btn-outline {
    background: transparent;
    color: #000000;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 16px 48px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-outline:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>