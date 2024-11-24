const paymentService = require('../services/paymentService')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const paymentController = {
    payWithMomo: async (req, res) => {
        try {
            const { finalPrice, planId } = req.body

            const { message, statusCode, result } =
                await paymentService.processPayment({
                    finalPrice,
                    planId,
                    userId: req.userId
                })

            if (message) return res.status(statusCode).json({ message })

            res.status(200).json({ data: result })
        } catch (err) {
            console.log(err)
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
    },

    getPendingPayment: async (req, res) => {
        try {
            const payment = await paymentService.getPendingPayment(req.userId)

            res.status(200).json({ data: payment })
        } catch (err) {
            res.status(500).json({
                message: err.message || DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = paymentController
