const mongoose = require('mongoose')
const Order = require('../models/Order')
const User = require('../models/User')
const Plan = require('../models/Plan')
const UserPlan = require('../models/UserPlan')

const paymentService = {
    processPayment: async ({ finalPrice, planId, userId }) => {
        // Validate object id type
        const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)
        if (!isValidObjectId(planId) || !isValidObjectId(userId))
            return { message: 'Invalid object id', statusCode: 400 }

        // Validate user, plan existence
        const user = await User.findById(userId)
        const plan = await Plan.findById(planId)
        if (!plan || !user)
            return { message: 'Invalid user or plan', statusCode: 404 }

        // Create order
        const order = await Order.create({
            finalPrice,
            plan: planId,
            user: userId
        })

        // Update user orders
        user.orders.push(order)
        await user.save()

        return { order, plan }
    },

    completePayment: async ({ resultCode, orderId }) => {
        // Validate object id type
        if (!mongoose.Types.ObjectId.isValid(orderId)) return

        // Validate order existence
        const order = await Order.findById(orderId).populate(['plan', 'user'])
        if (!order) return

        // Handle payment success
        if (resultCode === 0) {
            order.status = 'PAID'

            // Create user plan
            const startDate = new Date()
            const finishDate = new Date()
            finishDate.setMonth(finishDate.getMonth() + order.plan.month)

            const userPlan = await UserPlan.create({
                startDate,
                finishDate,
                status: 'VALID',
                plan: order.plan._id,
                user: order.user._id,
                order: order._id
            })

            // Update user plans
            order.user.plans.push(userPlan._id)
            await order.user.save()
        }

        // Handle payment fail
        if (resultCode !== 0) order.status = 'CANCELED'

        await order.save()
    }
}

module.exports = paymentService
