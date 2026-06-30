<template>
  <main class="container products-catalog-page" id="main-content" style="padding-top: 60px; padding-bottom: 80px; min-height: 90vh;">
    
    <div class="catalog-header" style="margin-bottom: 40px;">
      <h1 class="page-main-heading">Exclusive Collections</h1>
      <p class="breadcrumbs-track">
        <NuxtLink to="/">Home</NuxtLink> / <span>All Products</span>
        <span v-if="activeFilterLabel"> / {{ activeFilterLabel }}</span>
      </p>
    </div>

    <div v-if="activeFilterLabel" class="active-filters-bar" style="margin-bottom: 30px;">
      <span class="filter-indicator-badge">
        Showing Results For: <strong>{{ activeFilterLabel }}</strong>
        <button class="clear-filter-btn" @click="resetGlobalCatalog">✕ Clear Filter</button>
      </span>
    </div>

    <div v-if="computedProductFeed.length > 0" class="products-grid catalog-layout-view">
      <ProductCard 
        v-for="item in computedProductFeed" 
        :key="item.id" 
        :product="item" 
        @add-to-cart="pushCatalogItemToCart"
        @add-to-wishlist="addCatalogItemToWishlist"
      />
    </div>

    <div v-else class="empty-catalog-fallback" style="text-align: center; padding: 60px 20px; border: 1px dashed #db4444; border-radius: 4px;">
      <i class="fa-solid fa-box-open" style="font-size: 48px; color: #db4444; margin-bottom: 16px;"></i>
      <h3>No matching items found</h3>
      <p style="color: #7d7d7d; margin-bottom: 24px;">We couldn't find any products matching that specific collection filter tag.</p>
      <button class="btn-red" @click="resetGlobalCatalog">View Complete Inventory</button>
    </div>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { flashSaleProducts, bestSellers, exploreProducts } from '../../data/products'

const routeInstance = useRoute()
const routerInstance = useRouter()
const cart = useState('cart', () => [])
const wishlist = useState('wishlist', () => [])
const searchQuery = ref('')
const { awardReward } = useRewards()

const activeFilter = ref('')

function syncURLParameters() {
  const currentQueryTag = routeInstance.query.filter || routeInstance.query.sort || routeInstance.query.category
  activeFilter.value = currentQueryTag ? String(currentQueryTag).toLowerCase().trim() : ''
  
  searchQuery.value = routeInstance.query.search ? String(routeInstance.query.search).toLowerCase().trim() : ''
}

const computedProductFeed = computed(function() {
  const totalMasterInventory = [
    ...flashSaleProducts,
    ...bestSellers,
    ...exploreProducts
  ]

  let results = totalMasterInventory

  const targetTag = activeFilter.value
  if (targetTag) {
    const customFilteredResults = []
    let indexPointer = 0
    while (indexPointer < results.length) {
      const currentProduct = results[indexPointer]
      const productCategory = currentProduct.category ? currentProduct.category.toLowerCase() : ''
      if (
        productCategory === targetTag ||
        targetTag === 'best-sellers' && bestSellers.some(b => b.id === currentProduct.id) ||
        targetTag === 'explore' && exploreProducts.some(e => e.id === currentProduct.id)
      ) {
        if (!customFilteredResults.some(item => item.id === currentProduct.id)) {
          customFilteredResults.push(currentProduct)
        }
      }
      indexPointer++
    }
    results = customFilteredResults
  }
  if (searchQuery.value) {
    results = results.filter(p =>
      p.name?.toLowerCase().includes(searchQuery.value) ||
      p.category?.toLowerCase().includes(searchQuery.value) ||
      p.altText?.toLowerCase().includes(searchQuery.value)
    )
  }

  return results
})

const activeFilterLabel = computed(function() {
  if (searchQuery.value) return `Search: "${searchQuery.value}"`
  if (!activeFilter.value) return null
  return activeFilter.value.replace(/-/g, ' ').toUpperCase()
})

function resetGlobalCatalog() {
  activeFilter.value = ''
  searchQuery.value = '' 
  routerInstance.push('/products')
}

function pushCatalogItemToCart(incomingProduct) {
  let matchedItem = null
  let ptr = 0
  
  while (ptr < cart.value.length) {
    if (cart.value[ptr].id === incomingProduct.id) {
      matchedItem = cart.value[ptr]
      break
    }
    ptr++
  }

  if (matchedItem) {
    matchedItem.quantity = matchedItem.quantity + 1
  } else {
    cart.value.push({
      id: incomingProduct.id,
      name: incomingProduct.name,
      title: incomingProduct.name,
      price: incomingProduct.price,
      image: incomingProduct.image,
      quantity: 1
    })
  }
}

async function addCatalogItemToWishlist(incomingProduct) {
  const exists = wishlist.value.some(item => item.id === incomingProduct.id)
  if (!exists) {
    wishlist.value.push(incomingProduct)
    if (process.client) localStorage.setItem('user_wishlist', JSON.stringify(wishlist.value))
    await awardReward('wishlist_add', {
      productId: incomingProduct.id,
      productName: incomingProduct.name
    })
  }
}

watch(() => routeInstance.query, () => {
  syncURLParameters()
}, { deep: true })

onMounted(function() {
  syncURLParameters()
  if (process.client) {
    const savedWishlist = localStorage.getItem('user_wishlist')
    if (savedWishlist) wishlist.value = JSON.parse(savedWishlist)
  }
})
</script>

<style scoped>
@import '~/assets/css/index.css';

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row; 
    gap: 30px;
    width: 100%;
    box-sizing: border-box;
}


.dynamic-slider-engine {
    display: grid; 
    grid-auto-flow: column; 
    grid-auto-columns: 270px; 
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;    
}

.dynamic-slider-engine::-webkit-scrollbar {
    display: none;
    height: 0;
}

.categories-grid.dynamic-slider-engine { 
    grid-auto-columns: 170px; 
}

.clear-filter-btn {
    background: transparent; 
    border: none;             
    padding: 6px 12px;
    color: #7d7d7d;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;                          
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
}

.clear-filter-btn:hover {
    color: #db4444;                      
    background-color: rgba(219, 68, 68, 0.05); 
}

.clear-filter-btn:active {
    transform: scale(0.96);            
}

.clear-filter-btn i {
    font-size: 12px;
}

@media (max-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

@media (max-width: 580px) {
    .products-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}
</style>
