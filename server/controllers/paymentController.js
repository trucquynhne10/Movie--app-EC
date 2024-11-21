const momoService = require('../payment/momo/service')
const paymentService = require('../services/paymentService')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const paymentController = {
    payWithMomo: async (req, res) => {
        try {
            const { finalPrice, planId } = req.body

            const { message, statusCode, order, plan } =
                await paymentService.processPayment({
                    finalPrice,
                    planId,
                    userId: req.userId
                })

            if (message) return res.status(statusCode).json({ message })

            const result = await momoService.pay({
                amount: finalPrice,
                orderId: order._id.toString(),
                planName: plan.name
            })

            res.status(200).json({ data: result.data })
        } catch (err) {
            res.status(500).json({
                message: err.message || DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    callback: async (req, res) => {
        try {
            const { resultCode, orderId } = req.body

            await paymentService.completePayment({ resultCode, orderId })

            res.status(204)
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = paymentController
