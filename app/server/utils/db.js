import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://krishantson21_db_user:fNwKgN8CYiErrIJT%40@cluster0.ck8jmtw.mongodb.net/?appName=Cluster0"
let client
let clientPromise

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
  return { db, connectedClient }
}