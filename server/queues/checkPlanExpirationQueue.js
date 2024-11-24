require('dotenv').config()
const Queue = require('bull')
const mongoose = require('mongoose')
const moment = require('moment')
const UserPlan = require('../models/UserPlan')

const checkPlanExpirationQueue = new Queue('daily-plan-check', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD
    }
})

checkPlanExpirationQueue.process(async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log('Connected to MongoDB')

        const plans = await UserPlan.find({ status: 'VALID' })

        for (const plan of plans) {
            if (moment().isSameOrAfter(plan.finishDate, 'day')) {
                plan.status = 'INVALID'
                await plan.save()
            }
        }
    } catch (err) {
        console.log('Error running daily check', err)
    } finally {
        mongoose.disconnect()
        console.log('Disconnected from MongoDB')
    }
})

checkPlanExpirationQueue.add(
    {},
    {
        // Cron expression for daily at midnight
        repeat: { cron: '0 0 * * *' }
    }
)

module.exports = checkPlanExpirationQueue
