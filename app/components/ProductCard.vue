<template>
  <article class="product-card">
    <div class="img-wrapper">
      
      <span v-if="product.discount" class="discount-badge" aria-label="Discount amount">
        -{{ product.discount }}%
      </span>
      <span v-else-if="product.badge" class="discount-badge green-badge" style="background-color: #00FF66;">
        {{ product.badge }}
      </span>

      <div class="card-icons">
        <button aria-label="Add item to Wishlist" @click="$emit('add-to-wishlist', product)">
          <i class="fa-regular fa-heart" aria-hidden="true"></i>
        </button>
        <button aria-label="Quick view product details" @click="$emit('open-preview', product)">
          <i class="fa-regular fa-eye" aria-hidden="true"></i>
        </button>
      </div>

      <NuxtLink :to="`/${product.id}`" class="product-image-link">
        <img :src="product.image" :alt="product.altText || product.name" class="product-item-img" />
      </NuxtLink>

      <button 
        class="add-to-cart-btn" 
        @click="$emit('add-to-cart', product)" 
        role="button" 
        :aria-label="`Add ${product.name} to cart`"
      >
        Add To Cart
      </button>
    </div>

    <div class="card-details">
      <h3>
        <NuxtLink :to="`/${product.id}`" class="product-title-link">
          {{ product.name }}
        </NuxtLink>
      </h3>
      
      <p class="price-row">
        <span class="price-current">${{ product.price }}</span>
        <span v-if="product.oldPrice" class="price-old">
          <del>${{ product.oldPrice }}</del>
        </span>
      </p>
      
      <div class="stars" :aria-label="`Rated 5 stars out of 5 based on ${product.reviews} reviews`">
        ⭐⭐⭐⭐⭐ <span class="review-count" aria-hidden="true">({{ product.reviews }})</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['add-to-cart', 'add-to-wishlist', 'open-preview'])
</script>

<style scoped>
.product-image-link {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.product-title-link {
    color: inherit;
    text-decoration: none;
}

.product-title-link:hover {
    color: #db4444;
}

.img-wrapper .card-icons {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 20;
}

.img-wrapper .card-icons button {
    background-color: #ffffff;
    color: #000000;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    width: 34px;
    height: 34px;
    max-width: 34px;
    max-height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
    transition: color 0.2s ease, transform 0.1s ease;
}

.img-wrapper .card-icons button:hover {
    background-color: #ffffff;
    color: #db4444;
}

.img-wrapper .card-icons button:active {
    transform: translateY(2px);
}

.img-wrapper .card-icons button i {
    font-size: 16px;
    display: inline-block;
    line-height: 1;
    margin: 0;
    padding: 0;
}
</style>