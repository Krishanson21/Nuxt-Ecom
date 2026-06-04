<template>
  <main class="container contact-page-main">
    <div class="breadcrumb-trail">
      <NuxtLink to="/" active-class="active">Home</NuxtLink> <span>/</span> <p>Contact</p>
    </div>

    <div class="contact-split-layout text-only-split">
      <aside class="contact-sidebar-card">
        <div class="channel-group">
          <div class="channel-title-row">
            <div class="channel-icon-circle"><i class="fa-solid fa-phone"></i></div>
            <h3>Call To Us</h3>
          </div>
          <p>We are available 24/7, 7 days a week.</p>
          <p class="channel-details"><strong>Phone:</strong> +8801511133445</p>
        </div>

        <hr class="channel-divider" />

        <div class="channel-group">
          <div class="channel-title-row">
            <div class="channel-icon-circle"><i class="fa-regular fa-envelope"></i></div>
            <h3>Write To Us</h3>
          </div>
          <p>Fill out our form and we will contact you within 24 hours.</p>
          <p class="channel-details"><strong>Support:</strong> support@exclusive.com</p>
          <p class="channel-details"><strong>Sales:</strong> customer@exclusive.com</p>
        </div>
      </aside>

      <section class="contact-form-card">
        <form @submit.prevent="submitFormDirectly">
          <div class="form-inputs-trio">
            <input type="text" v-model="formData.name" placeholder="Your Name *" required />
            <input type="email" v-model="formData.email" placeholder="Your Email *" required />
            <input type="tel" v-model="formData.phone" placeholder="Your Phone *" required />
          </div>
          
          <div class="form-text-area-box">
            <textarea v-model="formData.message" rows="7" placeholder="Your Message *" required></textarea>
          </div>

          <div class="form-action-footer-row">
            <button type="submit" class="btn-red">Send Message</button>
            <p v-if="successAlert" class="success-message">Message sent successfully!</p>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const successAlert = ref(false)
const formData = ref({
  name: 'Krishan',
  email: 'Krishan@gmail.com',
  phone: '798787698',
  message: 'hi'
})

function submitFormDirectly() {
  successAlert.value = true
  formData.value = { name: '', email: '', phone: '', message: '' }
  setTimeout(() => { successAlert.value = false }, 4000)
}
</script>

<style scoped>
@import '~/assets/css/contact.css';

.text-only-split {
    grid-template-columns: 320px 1fr;
    margin-top: 10px;
}
.channel-details {
    color: #000000;
    font-size: 14px;
    margin-top: 4px;
}
.success-message {
    color: #2e7d32;
    font-size: 14px;
    font-weight: 500;
}
</style>