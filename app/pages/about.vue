<!-- app/pages/about.vue -->
<template>
  <main class="container about-page-main">
    <!-- Breadcrumbs Navigation -->
    <div class="breadcrumb-trail">
      <NuxtLink to="/" active-class="active">Home</NuxtLink> <span>/</span> <p>About</p>
    </div>

    <!-- Our Story Section -->
    <section class="story-text-only">
      <h1>Our Story</h1>
      <p>
        Launched in 2023, Exclusive is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data, and service solutions, Exclusive serves 3 million consumers across the region.
      </p>
      <p>
        Exclusive has more than 1 Million products to offer, growing at a very fast pace. Exclusive offers a diverse assortment in categories ranging from consumer electronics to household goods, beauty, fashion, sports equipment, and groceries.
      </p>
    </section>

    <!-- Statistics Grid Counters -->
    <section class="stats-matrix-grid">
      <div class="stat-box">
        <div class="stat-icon-outer">
          <div class="stat-icon-inner"><i class="fa-solid fa-store"></i></div>
        </div>
        <h2>10.5k</h2>
        <p>Sellers active on our site</p>
      </div>

      <div class="stat-box stat-box-highlight">
        <div class="stat-icon-outer">
          <div class="stat-icon-inner"><i class="fa-solid fa-dollar-sign"></i></div>
        </div>
        <h2>33k</h2>
        <p>Monthly Product Sale</p>
      </div>

      <div class="stat-box">
        <div class="stat-icon-outer">
          <div class="stat-icon-inner"><i class="fa-solid fa-gift"></i></div>
        </div>
        <h2>45.5k</h2>
        <p>Customers active on our site</p>
      </div>
    </section>

    <!-- Team Showcase Section -->
    <section class="team-showcase-grid text-only-team">
      <div class="member-card-plain">
        <h3>Tom Cruise</h3>
        <p class="role-title">Founder & Chairman</p>
      </div>

      <div class="member-card-plain">
        <h3>Emma Watson</h3>
        <p class="role-title">Managing Director</p>
      </div>

      <div class="member-card-plain">
        <h3>Will Smith</h3>
        <p class="role-title">Product Designer</p>
      </div>
    </section>
  </main>
</template>

<script setup>
// No form states or submission logic needed here!
</script>

<style scoped>
@import '~/assets/css/about.css';

.story-text-only {
    max-width: 800px;
    margin: 0 auto 60px auto;
    text-align: center;
}
.story-text-only h1 {
    font-size: 40px;
    font-weight: 600;
    margin-bottom: 20px;
}
.story-text-only p {
    font-size: 15px;
    line-height: 1.6;
    color: #3d3d3d;
    margin-bottom: 16px;
}
.member-card-plain {
    background-color: #f5f5f5;
    padding: 30px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.05);
}
.role-title {
    color: #db4444;
    font-weight: 500;
    font-size: 14px;
    margin-top: 4px;
}
</style>