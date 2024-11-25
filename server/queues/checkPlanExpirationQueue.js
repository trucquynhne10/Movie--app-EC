require('dotenv').config()
const Queue = require('bull')
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
        const plans = await UserPlan.find({ status: 'VALID' })

        for (const plan of plans) {
            if (moment().isSameOrAfter(plan.finishDate, 'day')) {
                plan.status = 'INVALID'
                await plan.save()
            }
        }
    } catch (err) {
        console.log('Error running daily check', err)
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
