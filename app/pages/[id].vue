<template>
  <main class="container product-details-page" style="padding-top: 80px; padding-bottom: 80px; min-height: 85vh;">
    
    <nav class="breadcrumbs" style="margin-bottom: 40px; font-size: 14px; color: #7d7d7d;">
      <NuxtLink to="/" style="color: #000; text-decoration: none;">Home</NuxtLink> / 
      <NuxtLink to="/products" style="color: #000; text-decoration: none;">Products</NuxtLink> / 
      <span>{{ product?.name || 'Loading...' }}</span>
    </nav>

    <div v-if="!product" style="text-align: center; padding: 40px 0;">
      <h2>Product Not Found</h2>
      <p style="margin-bottom: 20px;">The item you are looking for does not exist in our catalog directory.</p>
      <NuxtLink to="/products" class="btn-red">Back to All Products</NuxtLink>
    </div>

    <div v-else class="details-grid-container">
      
      <div class="gallery-showcase-box">
        <img :src="product.image" :alt="product.name" class="main-display-img" />
      </div>

      <div class="product-meta-panel">
        <h1 class="item-main-title">{{ product.name }}</h1>
        
        <div class="ratings-line" style="margin: 12px 0; font-size: 14px;">
          ⭐⭐⭐⭐⭐ <span style="color: #7d7d7d; margin-left: 8px;">({{ product.reviews || 0 }} Reviews)</span>
        </div>

        <div class="pricing-tier-row" style="margin: 16px 0; display: flex; align-items: center; gap: 16px;">
          <span class="price-current" style="font-size: 24px; font-weight: 600; color: #db4444;">${{ product.price }}</span>
          <span v-if="product.oldPrice" class="price-old" style="color: #7d7d7d; text-decoration: line-through; font-size: 18px;">${{ product.oldPrice }}</span>
        </div>

        <p class="product-summary-description">
          Experience premium quality and performance with the all-new {{ product.name }}. Designed meticulously to fit your day-to-day lifestyle with industry-leading reliability.
        </p>

        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 24px 0;" />

        <div class="purchase-actions-row" style="display: flex; gap: 16px; align-items: center;">
          <div class="quantity-counter-box">
            <button @click="adjustLocalQty(-1)">-</button>
            <span class="qty-num-lbl">{{ selectedQuantity }}</span>
            <button @click="adjustLocalQty(1)">+</button>
          </div>

          <button class="btn-red buy-now-cta" @click="addSelectedToCart">
            Buy Now
          </button>
        </div>

      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { flashSaleProducts, bestSellers, exploreProducts } from '../../data/products'

const routeInstance = useRoute()
const cart = useState('cart', () => [])
const selectedQuantity = ref(1)

const product = computed(() => {
  const currentUrlId = Number(routeInstance.params.id) || routeInstance.params.id
  const masterList = [...flashSaleProducts, ...bestSellers, ...exploreProducts]
  return masterList.find(item => item.id === currentUrlId)
})

function adjustLocalQty(value) {
  const result = selectedQuantity.value + value
  if (result >= 1 && result <= 10) {
    selectedQuantity.value = result
  }
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

.details-grid-container {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 60px;
    align-items: start;
}

.gallery-showcase-box {
    background-color: #f5f5f5;
    border-radius: 4px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.main-display-img {
    max-height: 400px;
    max-width: 90%;
    object-fit: contain;
}

.item-main-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #000;
}

.product-summary-description {
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    margin: 0;
}

.quantity-counter-box {
    display: flex;
    border: 1px solid #7d7d7d;
    border-radius: 4px;
    overflow: hidden;
    height: 44px;
}

.quantity-counter-box button {
    background: transparent;
    border: none;
    width: 40px;
    font-size: 20px;
    cursor: pointer;
}
.quantity-counter-box button:hover {
    background-color: #f0f0f0;
}

.qty-num-lbl {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    border-left: 1px solid #7d7d7d;
    border-right: 1px solid #7d7d7d;
}

.buy-now-cta {
    flex-grow: 1;
    height: 44px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 850px) {
    .details-grid-container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .gallery-showcase-box {
        height: 350px;
    }
}
</style>