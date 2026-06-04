<template>
  <main class="product-details-container">
    
    <nav class="breadcrumbs">
      <NuxtLink to="/">Home</NuxtLink>
      <i class="fa-solid fa-chevron-right separator"></i>
      <NuxtLink to="/products">Products</NuxtLink>
      <i class="fa-solid fa-chevron-right separator"></i>
      <span class="current-crumb">{{ product?.name || 'Loading Product...' }}</span>
    </nav>

    <div v-if="!product" class="not-found-wrapper">
      <div class="error-card">
        <i class="fa-solid fa-magnifying-glass-minus error-icon"></i>
        <h2>Product Not Found</h2>
        <p>The item you are looking for does not exist or has been relocated.</p>
        <NuxtLink to="/products" class="btn-primary">Return to Catalog</NuxtLink>
      </div>
    </div>

    <div v-else class="product-main-grid">
      
      <div class="gallery-wrapper">
        <div class="badge-overlay">
          <span v-if="product.discount" class="promo-badge discount">-{{ product.discount }}%</span>
          <span v-else-if="product.badge" class="promo-badge tag">{{ product.badge }}</span>
        </div>
        <div class="main-image-viewport">
          <img :src="product.image" :alt="product.name" class="hero-product-image" />
        </div>
      </div>

      <div class="details-panel-wrapper">
        <div class="product-header-block">
          <h1 class="product-main-title">{{ product.name }}</h1>
          
          <div class="meta-rating-row">
            <div class="stars-container">
              <i class="fa-solid fa-star filled"></i>
              <i class="fa-solid fa-star filled"></i>
              <i class="fa-solid fa-star filled"></i>
              <i class="fa-solid fa-star filled"></i>
              <i class="fa-solid fa-star filled"></i>
            </div>
            <span class="reviews-count-text">({{ product.reviews || 0 }} Customer Reviews)</span>
            <span class="divider-line">|</span>
            <span class="stock-status-indicator"><span class="pulse-dot"></span> In Stock</span>
          </div>

          <div class="pricing-showcase">
            <span class="current-price-tag">${{ product.price }}</span>
            <span v-if="product.oldPrice" class="slashed-old-price">${{ product.oldPrice }}</span>
          </div>
        </div>

        <p class="editorial-description">
          Elevate your daily setups with the premium craftsmanship of the {{ product.name }}. Engineered with industry-grade performance metrics, optimized ergonomics, and an exquisite aesthetic footprint designed to stand the test of time.
        </p>

        <hr class="section-divider" />

        <div class="product-options-picker">
          <div class="option-group">
            <span class="option-label">Colours:</span>
            <div class="color-swatches">
              <button class="swatch active" style="background-color: #A0B4C8;" aria-label="Blue Gray"></button>
              <button class="swatch" style="background-color: #DB4444;" aria-label="Crimson Red"></button>
            </div>
          </div>
        </div>

        <div class="checkout-actions-cluster">
          <div class="quantity-stepper-box">
            <button class="step-btn" @click="adjustLocalQty(-1)" aria-label="Decrease quantity">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="quantity-numerical-value">{{ selectedQuantity }}</span>
            <button class="step-btn" @click="adjustLocalQty(1)" aria-label="Increase quantity">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <button class="btn-primary direct-buy-cta" @click="addSelectedToCart">
            Buy Now
          </button>
          
          <button class="favorite-toggle-btn" aria-label="Bookmark item to wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>

        <div class="logistic-trust-matrix">
          <div class="logistic-row">
            <i class="fa-solid fa-truck-fast logistic-icon"></i>
            <div class="logistic-meta">
              <h4>Free Delivery</h4>
              <p>Enter your postal code for dynamic shipping availability updates.</p>
            </div>
          </div>
          <div class="logistic-row border-top">
            <i class="fa-solid fa-arrows-rotate logistic-icon"></i>
            <div class="logistic-meta">
              <h4>Return Delivery</h4>
              <p>Free 30-Day returns simplified. <a href="#">Details details here</a>.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { flashSaleProducts, bestSellers, exploreProducts } from '~/data/products'

const routeInstance = useRoute()
const cart = useState('cart', () => [])
const selectedQuantity = ref(1)

const product = computed(() => {
  const urlParamId = String(routeInstance.params.id).trim()
  const masterList = [...flashSaleProducts, ...bestSellers, ...exploreProducts]
  return masterList.find(item => String(item.id || item._id).trim() === urlParamId)
})

function adjustLocalQty(value) {
  const result = selectedQuantity.value + value
  if (result >= 1 && result <= 10) selectedQuantity.value = result
}

function addSelectedToCart() {
  if (!product.value) return
  const matchedItem = cart.value.find(item => item.id === product.value.id)
  if (matchedItem) {
    matchedItem.quantity += selectedQuantity.value
  } else {
    cart.value.push({
      id: product.value.id,
      title: product.value.name,
      price: product.value.price,
      image: product.value.image,
      quantity: selectedQuantity.value
    })
  }
  if (process.client) {
    localStorage.setItem('user_shopping_cart', JSON.stringify(cart.value))
  }
  selectedQuantity.value = 1
}
</script>

<style scoped>
@import '~/assets/css/index.css';
@import '~/assets/css/product-details.css';
</style>