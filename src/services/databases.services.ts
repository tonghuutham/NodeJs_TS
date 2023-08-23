import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv' // láy các biến từ file env
import User from '~/models/schemas/User.schema'

config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@testnamecluster.58zzncx.mongodb.net/?retryWrites=true&w=majority`

class DatabaseServicer {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.BD_USERS_COLLECTION as string)
  }
}

//Tạo object từ class DatabaseService
const databaseService = new DatabaseServicer()
export default databaseService
