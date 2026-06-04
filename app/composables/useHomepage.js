// app/composables/useHomepage.js
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useCartSync } from '~/composables/useCartSync'
import { flashSaleProducts, bestSellers, exploreProducts } from '~/data/products'

export function useHomepage() {
    // 🛒 Cart Logic
    const cart = useState('cart', () => [])
    const { fetchCartFromDB, syncCartToDB, initializeDeviceSession, isCartLoaded } = useCartSync()

    // 🏷️ Category Filter
    const selectedCategory = ref('camera')

    // ⏰ Flash Sale Countdown
    const dayView = ref('00')
    const hourView = ref('00')
    const minView = ref('00')
    const secView = ref('00')
    let clockTickerId = null
    const closingDate = new Date('June 5, 2026 00:00:00').getTime()

    // 🔄 Cart Database Watcher
    watch(cart, () => {
        if (isCartLoaded.value) syncCartToDB()
    }, { deep: true })

    // 🛍️ Cart Mutations
    function addToCart(product) {
        const existing = cart.value.find(item => item.id === product.id)
        if (existing) {
            existing.quantity++
        } else {
            cart.value.push({
                id: product.id,
                title: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            })
        }
        if (process.client) localStorage.setItem('user_shopping_cart', JSON.stringify(cart.value))
    }

    function handleCardQtyIncrement(targetProduct) {
        const basketEntry = cart.value.find(item => item.id === targetProduct.id)
        if (basketEntry) {
            basketEntry.quantity++
            if (process.client) localStorage.setItem('user_shopping_cart', JSON.stringify(cart.value))
        }
    }

    function handleCardQtyDecrement(targetProduct) {
        const basketEntry = cart.value.find(item => item.id === targetProduct.id)
        if (basketEntry) {
            basketEntry.quantity--
            if (basketEntry.quantity <= 0) {
                cart.value = cart.value.filter(item => item.id !== targetProduct.id)
            }
            if (process.client) localStorage.setItem('user_shopping_cart', JSON.stringify(cart.value))
        }
    }

    // ⏱️ Flash Sale Timer
    function runClockCalculation() {
        const rightNow = new Date().getTime()
        const timeWindowLeft = closingDate - rightNow
        if (timeWindowLeft < 0) {
            if (clockTickerId) clearInterval(clockTickerId)
            return
        }
        const oneSec = 1000
        const oneMin = oneSec * 60
        const oneHour = oneMin * 60
        const oneDay = oneHour * 24
        dayView.value = String(Math.floor(timeWindowLeft / oneDay)).padStart(2, '0')
        hourView.value = String(Math.floor((timeWindowLeft % oneDay) / oneHour)).padStart(2, '0')
        minView.value = String(Math.floor((timeWindowLeft % oneHour) / oneMin)).padStart(2, '0')
        secView.value = String(Math.floor((timeWindowLeft % oneMin) / oneSec)).padStart(2, '0')
    }

    // 🛹 Section Sliders
    const saleScroller = ref(null)
    const categoryScroller = ref(null)
    const exploreScroller = ref(null)
    const sliderTracksDirectory = { flash: saleScroller, categories: categoryScroller, explore: exploreScroller }

    function UniversalSlide(sectionKey, motionVector) {
        const targetRefElement = sliderTracksDirectory[sectionKey]?.value
        if (!targetRefElement) return
        const movementStepX = targetRefElement.clientWidth / 2 || 300
        targetRefElement.scrollBy({ left: motionVector === 'forward' ? movementStepX : -movementStepX, behavior: 'smooth' })
    }

    // 🎠 Hero Banner
    const heroBanners = ref([
        {
            brand: 'iPhone 17 Series',
            brandLogo: '/images/apple.png',
            headline: 'Up to 10%<br>off Voucher',
            ctaText: 'Shop Now',
            ctaLink: '/products?category=phones',
            image: '/images/herob1.png',
            imageAlt: 'iPhone 17 Pro',
            accent: '#f7be55',
            glow: 'radial-gradient(ellipse at 80% 50%, rgba(247,204,85,0.25) 0%, transparent 70%)',
            imageStyle: 'width: 480px; height: 280px; margin-right: 20px;',
        },
        {
            brand: 'iPhone 16 Series',
            brandLogo: '/images/apple.png',
            headline: 'Up to 10%<br>off Voucher',
            ctaText: 'Shop Now',
            ctaLink: '/products?category=phones',
            image: '/images/herob2.png',
            imageAlt: 'iPhone 16 Pro',
            accent: '#559bf7',
            glow: 'radial-gradient(ellipse at 80% 50%, rgba(85,247,180,0.25) 0%, transparent 70%)',
            imageStyle: 'width: 480px; height: 280px; margin-right: 20px;',
        },
    ])

    const currentBannerIndex = ref(0)
    let bannerTimer = null

    function nextBanner() {
        currentBannerIndex.value = (currentBannerIndex.value + 1) % heroBanners.value.length
        _restartBannerTimer()
    }
    function prevBanner() {
        currentBannerIndex.value = (currentBannerIndex.value - 1 + heroBanners.value.length) % heroBanners.value.length
        _restartBannerTimer()
    }
    function resetBannerAutoplay(index = null) {
        if (index !== null) currentBannerIndex.value = index
        _restartBannerTimer()
    }
    function _restartBannerTimer() {
        clearInterval(bannerTimer)
        bannerTimer = setInterval(nextBanner, 5000)
    }

    // 🔊 Promo Banner + Timer
    const promoBanner = ref({
        category: 'Categories',
        headline: 'Enhance Your<br>Music Experience',
        timerEnd: Date.now() + (5 * 86400 + 23 * 3600 + 59 * 60 + 35) * 1000,
        ctaText: 'Buy Now!',
        ctaLink: '/products?category=speakers',
        image: '/images/speaker.png',
        imageAlt: 'Bluetooth Speaker',
        imageClass: 'tilt',
        imageStyle: 'width: 580px; height: 280px; margin-right: 20px;',
        glow: 'radial-gradient(ellipse at 75% 60%, rgba(34,197,94,0.18) 0%, transparent 65%)',
    })

    const now = ref(Date.now())
    let nowTimer = null

    const promoTimerUnits = computed(() => {
        const total = Math.floor(Math.max(0, promoBanner.value.timerEnd - now.value) / 1000)
        return [
            { label: 'Hours',   value: String(Math.floor((total % 86400) / 3600)).padStart(2, '0') },
            { label: 'Days',    value: String(Math.floor(total / 86400)).padStart(2, '0') },
            { label: 'Minutes', value: String(Math.floor((total % 3600) / 60)).padStart(2, '0') },
            { label: 'Seconds', value: String(total % 60).padStart(2, '0') },
        ]
    })

    // 📅 Single onMounted / onUnmounted
    onMounted(() => {
        initializeDeviceSession()
        fetchCartFromDB()
        runClockCalculation()
        clockTickerId = setInterval(runClockCalculation, 1000)
        resetBannerAutoplay()
        nowTimer = setInterval(() => { now.value = Date.now() }, 1000)
    })

    onUnmounted(() => {
        clearInterval(clockTickerId)
        clearInterval(bannerTimer)
        clearInterval(nowTimer)
    })

    return {
        flashSaleProducts, bestSellers, exploreProducts,
        dayView, hourView, minView, secView,
        selectedCategory, currentBannerIndex, heroBanners,
        saleScroller, categoryScroller, exploreScroller,
        addToCart, handleCardQtyIncrement, handleCardQtyDecrement,
        UniversalSlide, nextBanner, prevBanner, resetBannerAutoplay,
        promoBanner, promoTimerUnits,
    }
}