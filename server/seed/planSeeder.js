const Plan = require('../models/Plan')

const seedPlans = async () => {
    const default_plans = [
        {
            name: '1 Month',
            price: 50000,
            month: 1
        },
        {
            name: '3 Months',
            price: 150000,
            month: 3
        },
        {
            name: '6 Months',
            price: 300000,
            month: 6
        },
        {
            name: '12 Months',
            price: 600000,
            month: 12
        }
    ]

    for (const plan of default_plans) {
        const planExists = await Plan.findOne({ name: plan.name })

        if (!planExists) {
            await Plan.create(plan)
            console.log(`${plan.name} was created`)
        }
    }
}

module.exports = seedPlans
