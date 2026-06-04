import { connectToDatabase } from '../utils/db'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const query = getQuery(event)
  const deviceId = getHeader(event, 'x-device-id') || query.deviceId

  if (!deviceId) {
    return { error: 'Device tracking identifier missing' }
  }

  const { db } = await connectToDatabase()
  const cartCollection = db.collection('anonymous_carts')

  if (method === 'GET') {
    const activeRecord = await cartCollection.findOne({ deviceId })
    return activeRecord ? activeRecord.items : []
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const incomingItems = body.items || []

    await cartCollection.updateOne(
      { deviceId },
      { $set: { deviceId, items: incomingItems, lastUpdatedAt: new Date() } },
      { upsert: true }
    )

    return { success: true }
  }
})