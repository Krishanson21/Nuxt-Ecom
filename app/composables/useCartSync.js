export function useCartSync() {
  const cart = useState('cart', () => [])
  const deviceFingerprint = useState('device-id', () => null)
  const isCartLoaded = useState('is-cart-loaded', () => false)

  function initializeDeviceSession() {
    if (!process.client) return
    
    let localId = localStorage.getItem('anon_store_device_id')
    if (!localId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        localId = 'dev_' + crypto.randomUUID()
      } else {
        localId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      }
      localStorage.setItem('anon_store_device_id', localId)
    }
    deviceFingerprint.value = localId
  }

  async function fetchCartFromDB() {
    if (!deviceFingerprint.value) initializeDeviceSession()

    try {
      const data = await $fetch('/api/cart', {
        headers: { 'x-device-id': deviceFingerprint.value }
      })
      
      if (data && Array.isArray(data)) {
        cart.value = data
      }
    } catch (error) {
      console.error('Failed to load database records:', error)
    } finally {
      isCartLoaded.value = true
    }
  }

  async function syncCartToDB() {
    if (!deviceFingerprint.value || !isCartLoaded.value) return

    try {
      await $fetch('/api/cart', {
        method: 'POST',
        headers: { 'x-device-id': deviceFingerprint.value },
        body: { items: cart.value }
      })
    } catch (error) {
      console.error('Database streaming error:', error)
    }
  }

  return {
    cart,
    isCartLoaded,
    fetchCartFromDB,
    syncCartToDB,
    initializeDeviceSession
  }
}