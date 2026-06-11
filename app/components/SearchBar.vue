<template>
  <template>
  <div v-click-outside="closeSearchDropdown" style="display: contents;">
    <label for="global-search" class="sr-only">Search Products</label>
    <input
        id="global-search"
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearchSubmit"
        @input="handleSearchInput"
        @keydown.escape="closeSearchDropdown"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        placeholder="What are you looking for?"
        autocomplete="off"
    />

    <!-- Dropdown -->
    <div class="search-dropdown" v-if="searchDropdownVisible && dropdownResults.length > 0">
    <NuxtLink
        v-for="(product, index) in dropdownResults"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="search-dropdown-item"
        :class="{ 'is-active': selectedIndex === index }"
        @click="handleDropdownSelect"
        @mouseenter="selectedIndex = index"
        @mouseleave="selectedIndex = -1"
    >
    <img :src="product.image" :alt="product.altText" class="dropdown-product-img" />
    <div class="dropdown-product-info">
      <span class="dropdown-product-name">{{ product.name }}</span>
      <span class="dropdown-product-price">${{ product.price }}</span>
    </div>
  </NuxtLink>

  <div
    class="search-dropdown-footer"
    v-if="allMatchingResults.length > dropdownResults.length"
    @click="handleSearchSubmit"
  >
    See all {{ allMatchingResults.length }} results for "{{ searchQuery }}"
  </div>
</div>

<div
  class="search-dropdown"
  v-else-if="searchDropdownVisible && searchQuery.trim().length > 0 && dropdownResults.length === 0"
>
  <div class="search-dropdown-empty">No products found for "{{ searchQuery }}"</div>
</div>
  </div>
</template>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { flashSaleProducts, bestSellers, exploreProducts } from '~/data/products'

const router = useRouter()
const searchQuery = ref('')
const searchDropdownVisible = ref(false)

const allProducts = computed(() => [
  ...flashSaleProducts,
  ...bestSellers,
  ...exploreProducts
])

const selectedIndex = ref(-1)

function moveDown() {
  if (!searchDropdownVisible.value) return
  selectedIndex.value = (selectedIndex.value + 1) % dropdownResults.value.length
}

function moveUp() {
  if (!searchDropdownVisible.value) return
  selectedIndex.value = (selectedIndex.value - 1 + dropdownResults.value.length) % dropdownResults.value.length
}

const allMatchingResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []
  return allProducts.value.filter(p =>
    p.name?.toLowerCase().includes(query) ||
    p.category?.toLowerCase().includes(query) ||
    p.altText?.toLowerCase().includes(query)
  )
})

const dropdownResults = computed(() => allMatchingResults.value.slice(0, 5))

function handleSearchInput() {
  searchDropdownVisible.value = true
  selectedIndex.value = -1
}

function closeSearchDropdown() {
  searchDropdownVisible.value = false
  selectedIndex.value = -1
}

function handleDropdownSelect() {
  searchQuery.value = ''
  searchDropdownVisible.value = false
  selectedIndex.value = -1
}

function handleSearchSubmit() {
  if (selectedIndex.value >= 0 && dropdownResults.value[selectedIndex.value]) {
    const product = dropdownResults.value[selectedIndex.value]
    router.push(`/products/${product.id}`)
    searchQuery.value = ''
    searchDropdownVisible.value = false
    selectedIndex.value = -1
    return
  }

  const cleanQuery = searchQuery.value.trim()
  if (!cleanQuery) return
  router.push(`/products?search=${encodeURIComponent(cleanQuery.toLowerCase())}`)
  searchQuery.value = ''
  searchDropdownVisible.value = false
  selectedIndex.value = -1
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
.search-box {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
}

.search-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  text-decoration: none;
  color: #1a1a1a;
  transition: background 0.15s ease;
  border-bottom: 1px solid #f5f5f5;
}

.search-dropdown-item:last-child {
  border-bottom: none;
}

.search-dropdown-item:hover {
  background: #f9f9f9;
}

.dropdown-product-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  background: #f5f5f5;
  flex-shrink: 0;
}

.dropdown-product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.search-dropdown-item.is-active {
  background: #f9f9f9;
  outline: 2px solid #db4444;
  outline-offset: -2px;
}

.dropdown-product-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-product-price {
  font-size: 13px;
  color: #db4444;
  font-weight: 600;
}

.search-dropdown-footer {
  padding: 10px 14px;
  font-size: 13px;
  color: #db4444;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  transition: background 0.15s ease;
}

.search-dropdown-footer:hover {
  background: #f0f0f0;
}

.search-dropdown-empty {
  padding: 16px 14px;
  font-size: 14px;
  color: #7d7d7d;
  text-align: center;
}
.search-box input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 12px;
    width: 211px;
}
</style>