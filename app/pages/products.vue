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

// Import all your master datasets directly
import { flashSaleProducts, bestSellers, exploreProducts } from '../data/products'

const routeInstance = useRoute()
const routerInstance = useRouter()
const cart = useState('cart', () => [])

// Track active query values dynamically inside local components
const activeFilter = ref('')

function syncURLParameters() {
  // Capture whatever filter or category value was passed along inside the URL address field
  const currentQueryTag = routeInstance.query.filter || routeInstance.query.sort || routeInstance.query.category
  activeFilter.value = currentQueryTag ? String(currentQueryTag).toLowerCase().trim() : ''
}

// 🧑‍💻 HUMANIZED: Combine all data records and run an explicit handwritten filtering matrix
const computedProductFeed = computed(function() {
  // Step A: Pool every single element from your multi-array data file together seamlessly
  const totalMasterInventory = [
    ...flashSaleProducts,
    ...bestSellers,
    ...exploreProducts
  ]

  // Step B: If no parameters are active or specified, return the entire database array instantly!
  const targetTag = activeFilter.value
  if (!targetTag) {
    return totalMasterInventory
  }

  // Step C: Run a manual procedural extraction loop to separate targeted matches
  const customFilteredResults = []
  let indexPointer = 0

  while (indexPointer < totalMasterInventory.length) {
    const currentProduct = totalMasterInventory[indexPointer]
    
    // Normalize string parameters to ensure solid matching patterns
    const productCategory = currentProduct.category ? currentProduct.category.toLowerCase() : ''
    
    // Check if item category matches the URL tag, or if the user clicked specific landing rows
    if (
      productCategory === targetTag || 
      targetTag === 'best-sellers' && bestSellers.some(b => b.id === currentProduct.id) ||
      targetTag === 'explore' && exploreProducts.some(e => e.id === currentProduct.id)
    ) {
      // Deduplicate items to prevent identical items from appearing twice across sections
      if (!customFilteredResults.some(item => item.id === currentProduct.id)) {
        customFilteredResults.push(currentProduct)
      }
    }
    indexPointer++
  }

  return customFilteredResults
})

// Humanized formatting tag labels for display headers
const activeFilterLabel = computed(function() {
  if (!activeFilter.value) return null
  return activeFilter.value.replace(/-/g, ' ').toUpperCase()
})

function resetGlobalCatalog() {
  activeFilter.value = ''
  // Safely wipe out URL query fields cleanly without refreshing the layout view state
  routerInstance.push('/products')
}

// Global Cart Actions Sync Manager
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
      title: incomingProduct.title,
      price: incomingProduct.price,
      image: incomingProduct.image,
      quantity: 1
    })
  }
}

// Watchers ensure that if a user clicks a route link while already sitting inside this view, it forces an update
watch(() => routeInstance.query, () => {
  syncURLParameters()
}, { deep: true })

onMounted(function() {
  syncURLParameters()
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