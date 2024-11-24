const mongoose = require('mongoose')
const Order = require('../models/Order')
const User = require('../models/User')
const Plan = require('../models/Plan')
const UserPlan = require('../models/UserPlan')
const momoService = require('../payment/momo/service')

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
        const order = new Order({
            finalPrice,
            plan: planId,
            user: userId
        })

        // Call momo API
        const result = await momoService.pay({
            amount: finalPrice,
            orderId: order._id.toString(),
            planName: plan.name
        })

        // Save pay url
        order.payUrl = result.data.shortLink
        await order.save()

        // Update user orders
        user.orders.push(order)
        await user.save()

        return { result: result.data }
    },

    completePayment: async ({ resultCode, orderId }) => {
        // Validate object id type
        if (!mongoose.Types.ObjectId.isValid(orderId)) return

        // Validate order existence
        const order = await Order.findById(orderId).populate(['plan', 'user'])
        if (!order) return

        // Handle payment fail
        if (resultCode !== 0) {
            order.status = 'CANCELED'
            return await order.save()
        }

        // Handle payment success
        const validMembership = await UserPlan.findOne({
            user: order.user._id,
            status: 'VALID'
        })

        order.status = 'PAID'

        // Add month to current membership
        if (validMembership) {
            const finishDate = new Date(validMembership.finishDate)
            finishDate.setMonth(finishDate.getMonth() + order.plan.month)

            validMembership.finishDate = finishDate
            await validMembership.save()
            return await order.save()
        }

        // Create new membership
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

        order.user.plans.push(userPlan._id)
        await order.user.save()
        await order.save()
    },

    getPendingPayment: async (userId) =>
        await Order.findOne({
            user: userId,
            status: 'PENDING'
        })
}

module.exports = paymentService
