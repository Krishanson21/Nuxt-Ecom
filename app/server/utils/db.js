import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let client
let clientPromise
let indexesPromise

if (!uri) {
  throw new Error('Please add your MONGODB_URI to your .env file')
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  const connectedClient = await clientPromise
  const db = connectedClient.db()
  if (!indexesPromise) indexesPromise = ensureIndexes(db)
  await indexesPromise
  return { db, connectedClient }
}

async function ensureIndexes(db) {
  await db.collection('reward_ledger').createIndexes([
    { key: { userKey: 1, createdAt: -1 }, name: 'reward_user_createdAt' },
    { key: { userKey: 1, action: 1 }, name: 'reward_user_action' },
    { key: { userKey: 1, action: 1, 'metadata.productId': 1 }, name: 'reward_wishlist_product' },
    { key: { userKey: 1, action: 1, createdAt: -1 }, name: 'reward_daily_check_in' }
  ])
}
