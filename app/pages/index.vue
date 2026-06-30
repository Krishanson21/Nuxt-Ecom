<template>
  <main class="container homepage-main" id="main-content">

    <section class="hero-section" aria-label="Featured Promotions">
      <nav class="sidebar" aria-label="Main Categories">
        <ul>
          <li><a href="#">Woman's Fashion <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a></li>
          <li><a href="#">Men's Fashion <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a></li>
          <li><a href="#">Electronics</a></li>
          <li><a href="#">Home & Lifestyle</a></li>
          <li><a href="#">Medicine</a></li>
          <li><a href="#">Sports & Outdoor</a></li>
          <li><a href="#">Baby's & Toys</a></li>
          <li><a href="#">Groceries & Pets</a></li>
          <li><a href="#">Health & Beauty</a></li>
        </ul>
      </nav>

      <div class="hero-banner" :style="{ '--accent': heroBanners[currentBannerIndex]?.accent }">
        <transition name="slide-fade" mode="out-in">
          <div class="banner-inner" :key="currentBannerIndex">
            <div class="bg-glow" :style="{ background: heroBanners[currentBannerIndex]?.glow }"></div>

            <div class="banner-content">
              <div v-if="heroBanners[currentBannerIndex]?.brand" class="banner-brand">
                <img :src="heroBanners[currentBannerIndex].brandLogo" class="banner-brand-logo" />
                <span>{{ heroBanners[currentBannerIndex].brand }}</span>
              </div>
              <h2 class="banner-headline" v-html="heroBanners[currentBannerIndex]?.headline"></h2>
              <NuxtLink :to="heroBanners[currentBannerIndex]?.ctaLink || '/products'" class="banner-cta">
                {{ heroBanners[currentBannerIndex]?.ctaText }}
                <i class="fa-solid fa-arrow-right"></i>
              </NuxtLink>
            </div>

            <div class="banner-product-wrap">
              <img :src="heroBanners[currentBannerIndex]?.image" :alt="heroBanners[currentBannerIndex]?.imageAlt"
                :style="heroBanners[currentBannerIndex]?.imageStyle"
                :class="['banner-product-img', heroBanners[currentBannerIndex]?.imageClass]"
                class="banner-product-img" />
            </div>
          </div>
        </transition>

        <div class="banner-dots">
          <button v-for="(_, i) in heroBanners" :key="i" class="banner-dot"
            :class="{ active: i === currentBannerIndex }" @click="resetBannerAutoplay(i)" />
        </div>
        <button class="banner-arrow banner-arrow-prev" @click="prevBanner"><i
            class="fa-solid fa-chevron-left"></i></button>
        <button class="banner-arrow banner-arrow-next" @click="nextBanner"><i
            class="fa-solid fa-chevron-right"></i></button>
      </div>
    </section>

    <section class="section-container" aria-labelledby="flash-sale-heading">
      <div class="section-tag" aria-hidden="true">Today's</div>
      <div class="section-header-row">
        <h2 id="flash-sale-heading" class="section-title">Flash Sales</h2>
        <div class="countdown-clock" role="timer" :aria-label="`Flash sales end in ${dayView} days, ${hourView} hours`">
          <div class="time-segment">
            <span class="label">Days</span>
            <span class="num">{{ dayView }}</span>
          </div>
          <span class="colon" aria-hidden="true">:</span>

          <div class="time-segment">
            <span class="label">Hours</span>
            <span class="num">{{ hourView }}</span>
          </div>
          <span class="colon" aria-hidden="true">:</span>

          <div class="time-segment">
            <span class="label">Minutes</span>
            <span class="num">{{ minView }}</span>
          </div>
          <span class="colon" aria-hidden="true">:</span>

          <div class="time-segment">
            <span class="label">Seconds</span>
            <span class="num">{{ secView }}</span>
          </div>
        </div>
        <div class="slider-arrows" aria-hidden="true">
          <button class="arrow-btn" aria-label="Previous" @click="UniversalSlide('flash', 'back')">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button class="arrow-btn" aria-label="Next" @click="UniversalSlide('flash', 'forward')">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div ref="saleScroller" class="products-grid dynamic-slider">
        <ProductCard v-for="product in flashSaleProducts" :key="product.id" :product="product" @add-to-cart="addToCart"
          @add-to-wishlist="addToWishlist" @increase-qty="handleCardQtyIncrement" @decrease-qty="handleCardQtyDecrement" />
      </div>
      <div class="center-btn-wrapper">
        <NuxtLink to="/products" class="btn-red text-center display-inline-block">
          View All Products
        </NuxtLink>
      </div>
    </section>

    <section class="section-container border-top" aria-labelledby="category-heading">
      <div class="section-tag" aria-hidden="true">Categories</div>
      <div class="section-header-row">
        <h2 id="category-heading" class="section-title">Browse By Category</h2>
        <div class="slider-arrows" aria-hidden="true">
          <button class="arrow-btn" @click="UniversalSlide('categories', 'back')"><i
              class="fa-solid fa-arrow-left"></i></button>
          <button class="arrow-btn" @click="UniversalSlide('categories', 'forward')"><i
              class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
      <div ref="categoryScroller" class="categories-grid dynamic-slider">
        <NuxtLink to="/products?category=phones" class="category-box" tabindex="0" role="button"
          aria-label="Browse Phones">
          <img src="/images/i1.png" alt="Phone icon" width="58px" class="category-icon-img" />
          <p>Phones</p>
        </NuxtLink>

        <NuxtLink to="/products?category=computers" class="category-box" tabindex="0" role="button"
          aria-label="Browse Computers">
          <img src="/images/i2.png" alt="Computer icon" class="category-icon-img" />
          <p>Computers</p>
        </NuxtLink>

        <NuxtLink to="/products?category=smartwatch" class="category-box" tabindex="0" role="button"
          aria-label="Browse Smartwatches">
          <img src="/images/i3.png" alt="Smartwatches icon" class="category-icon-img" />
          <p>SmartWatch</p>
        </NuxtLink>

        <NuxtLink to="/products?category=camera" class="category-box active" tabindex="0" role="button"
          aria-label="Browse Cameras">
          <img src="/images/i4.png" alt="Cameras icon" class="category-icon-img" />
          <p>Camera</p>
        </NuxtLink>

        <NuxtLink to="/products?category=headphones" class="category-box" tabindex="0" role="button"
          aria-label="Browse Headphones">
          <img src="/images/i5.png" alt="Headphones icon" class="category-icon-img" />
          <p>HeadPhones</p>
        </NuxtLink>

        <NuxtLink to="/products?category=gaming" class="category-box" tabindex="0" role="button"
          aria-label="Browse Gaming Consoles">
          <img src="/images/i6.png" alt="Console icon" class="category-icon-img" />
          <p>Gaming</p>
        </NuxtLink>
      </div>
    </section>

    <section class="section-container border-top" aria-labelledby="best-selling-heading">
      <div class="section-tag" aria-hidden="true">This Month</div>
      <div class="section-header-row">
        <h2 class="section-title">Best Selling Products</h2>
        <NuxtLink to="/products?filter=best-sellers" class="btn-red side-action-btn display-inline-block">
          View All
        </NuxtLink>
      </div>

      <div class="products-grid">
        <ProductCard v-for="product in bestSellers" :key="product.id" :product="product" @add-to-cart="addToCart"
          @add-to-wishlist="addToWishlist" @increase-qty="handleCardQtyIncrement" @decrease-qty="handleCardQtyDecrement" />
      </div>
    </section>

    <section class="promo-music-section" aria-label="Special Speaker Offer Promotion" style="margin-top: 90px;">
      <section class="promo-music-section" aria-label="Special Offer Promotion" style="margin-top: 10px;">
        <div class="bg-glow" :style="{ background: promoBanner.glow }"></div>

        <div class="promo-content">
          <span v-if="promoBanner.category" class="banner-category">{{ promoBanner.category }}</span>
          <h2 class="banner-headline" v-html="promoBanner.headline"></h2>
          <div class="banner-countdown">
            <div class="b-time-unit" v-for="unit in promoTimerUnits" :key="unit.label">
              <span class="b-time-value">{{ unit.value }}</span>
              <span class="b-time-label">{{ unit.label }}</span>
            </div>
          </div>
          <NuxtLink :to="promoBanner.ctaLink || '/products'" class="promo-cta">
            {{ promoBanner.ctaText }}
          </NuxtLink>
        </div>

        <div class="promo-img-box">
          <img :src="promoBanner.image" :alt="promoBanner.imageAlt" class="boombox-img" :class="promoBanner.imageClass"
            :style="promoBanner.imageStyle" />
        </div>
      </section>
    </section>

    <section class="section-container" aria-labelledby="explore-heading">
      <div class="section-tag" aria-hidden="true">Our Products</div>
      <div class="section-header-row">
        <h2 id="explore-heading" class="section-title">Explore Our Products</h2>
        <div class="slider-arrows" aria-hidden="true">
          <button class="arrow-btn" @click="UniversalSlide('explore', 'back')"><i
              class="fa-solid fa-arrow-left"></i></button>
          <button class="arrow-btn" @click="UniversalSlide('explore', 'forward')"><i
              class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      <div ref="exploreScroller" class="products-grid explore-rows dynamic-slider">
        <ProductCard v-for="product in exploreProducts" :key="product.id" :product="product" @add-to-cart="addToCart"
          @add-to-wishlist="addToWishlist" @increase-qty="handleCardQtyIncrement" @decrease-qty="handleCardQtyDecrement" />
      </div>
      <div class="center-btn-wrapper">
        <NuxtLink to="/products?sort=explore" class="btn-red text-center display-inline-block">
          View All Products
        </NuxtLink>
      </div>
    </section>

    <section class="section-container border-top" aria-labelledby="new-arrival-heading">
      <div class="section-tag" aria-hidden="true">Featured</div>
      <h2 id="new-arrival-heading" class="section-title text-block-gap">New Arrival</h2>
      <div class="arrival-mosaic-grid">
        <div class="mosaic-card bg-black">
          <img src="/images/ps5.png" alt="A white PlayStation 5 gaming console standing vertically"
            class="mosaic-img-cover" />
        </div>

        <div class="mosaic-card bg-black">
          <img src="/images/woman.png" alt="A woman wearing a wide-brimmed black hat" class="mosaic-img-cover" />
        </div>

        <div class="mosaic-card bg-black">
          <img src="/images/speakers-small.png" alt="Two black smart speakers standing next to each other"
            class="mosaic-img-sm" />
        </div>

        <div class="mosaic-card bg-black">
          <img src="/images/perfume.png" alt="A luxury glass bottle of Gucci perfume" class="mosaic-img-sm" />
        </div>
      </div>
    </section>

    <section class="value-propositions-bar" aria-label="Customer Guarantees">
      <div class="prop-item">
        <div class="icon-circle">
          <div class="inner-circle"><img src="/images/f1.png" alt="" aria-hidden="true" /></div>
        </div>
        <h3>FREE AND FAST DELIVERY</h3>
        <p>Free delivery for all orders over $140</p>
      </div>
      <div class="prop-item">
        <div class="icon-circle">
          <div class="inner-circle"><img src="/images/f2.png" alt="" aria-hidden="true" /></div>
        </div>
        <h3>24/7 CUSTOMER SERVICE</h3>
        <p>Friendly 24/7 customer support</p>
      </div>
      <div class="prop-item">
        <div class="icon-circle">
          <div class="inner-circle"><img src="/images/f3.png" alt="" aria-hidden="true" /></div>
        </div>
        <h3>MONEY BACK GUARANTEE</h3>
        <p>We return money within 30 days</p>
      </div>
    </section>

  </main>
</template>

<script setup>

const {
  flashSaleProducts, bestSellers, exploreProducts,
  dayView, hourView, minView, secView,
  selectedCategory, currentBannerIndex, heroBanners,
  saleScroller, categoryScroller, exploreScroller,
  addToCart, addToWishlist, handleCardQtyIncrement, handleCardQtyDecrement,
  UniversalSlide, nextBanner, prevBanner, resetBannerAutoplay,promoBanner,promoTimerUnits,
} = useHomepage()
</script>

<style scoped>
@import '~/assets/css/index.css';
</style>
