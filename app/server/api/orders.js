import { connectToDatabase } from '../utils/db'

function validateOrderItem(item, index) {
  const price = Number(item?.price)
  const quantity = Number(item?.quantity || 1)

  if (!item?.id) return `Order item ${index + 1} is missing a product ID`
  if (!Number.isFinite(price) || price <= 0) return `Order item ${index + 1} has an invalid price`
  if (!Number.isInteger(quantity) || quantity <= 0) return `Order item ${index + 1} has an invalid quantity`
  return null
}

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method not allowed' }
  }

  const userKey = getHeader(event, 'x-user-key')
  if (!userKey) {
    setResponseStatus(event, 400)
    return { error: 'User identity missing' }
  }

  const body = await readBody(event)
  const items = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    setResponseStatus(event, 400)
    return { error: 'Order must contain at least one item' }
  }

  const invalidItemMessage = items.map(validateOrderItem).find(Boolean)
  if (invalidItemMessage) {
    setResponseStatus(event, 400)
    return { error: invalidItemMessage }
  }

  const normalizedItems = items.map((item) => ({
    productId: item.id,
    name: item.name || item.title,
    price: Number(item.price),
    quantity: Number(item.quantity || 1),
    image: item.image || ''
  }))

  const orderTotal = normalizedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const { db } = await connectToDatabase()
  const order = {
    userKey,
    items: normalizedItems,
    orderTotal,
    status: 'completed',
    createdAt: new Date()
  }

  const result = await db.collection('orders').insertOne(order)

  return {
    success: true,
    orderId: String(result.insertedId),
    orderTotal
  }
})
