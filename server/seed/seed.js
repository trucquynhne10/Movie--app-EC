require('dotenv').config()
const mongoose = require('mongoose')
const seedPlans = require('./planSeeder')

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log('Connected to MongoDB')
        console.log('Seeding...')

        await seedPlans()

        console.log('All seeders ran successfully!')
    } catch (err) {
        console.log('Error running seeders', err)
    } finally {
        mongoose.disconnect()
        console.log('Disconnected from MongoDB')
    }
}

seedDatabase()
