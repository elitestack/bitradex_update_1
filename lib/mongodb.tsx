// lib/mongodb.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise




// // lib/mongodb.ts
// import { MongoClient, MongoClientOptions } from 'mongodb';


// declare global {
//   // eslint-disable-next-line no-var
//   var _mongoClientPromise: Promise<MongoClient> | undefined
// }

// const uri = process.env.MONGODB_URI
// const options: MongoClientOptions = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>

// if (!uri) {
//   throw new Error('Please add your Mongo URI to .env.local')
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     global._mongoClientPromise = client.connect().then(client => {
//       console.log('Connected to MongoDB (development)')
//       return client
//     })
//   }
//   clientPromise = global._mongoClientPromise!
// } else {
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect().then(client => {
//     console.log('Connected to MongoDB (production)')
//     return client
//   })
// }

// export default clientPromise
