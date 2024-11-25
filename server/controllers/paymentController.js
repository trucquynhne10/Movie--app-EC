const paymentService = require('../services/paymentService')
const voucherService = require('../services/voucherService')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const paymentController = {
    createPayment: async (req, res) => {
        try {
            const { planId, method, voucherCode } = req.body

            let finalPrice = req.body.finalPrice
            if (voucherCode) {
                const { data, message, statusCode } =
                    await voucherService.applyVoucher({
                        voucherCode,
                        price: finalPrice,
                        userId: req.userId
                    })

                if (message && statusCode)
                    return res.status(statusCode).json({ message })

                finalPrice = data.finalPrice
            }

            const { message, statusCode, result } =
                await paymentService.processPayment({
                    finalPrice,
                    planId,
                    method,
                    userId: req.userId
                })

            // Return if validate fail
            if (message && statusCode)
                return res.status(statusCode).json({ message })

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

            await voucherService.createPromoCode({ resultCode, orderId })

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
    },

    applyVoucher: async (req, res) => {
        try {
            const { voucherCode, price } = req.body

            const { message, statusCode, data } =
                await voucherService.applyVoucher({
                    voucherCode,
                    price,
                    userId: req.userId
                })

            if (message && statusCode)
                return res.status(statusCode).json({ message })

            res.status(200).json({ data })
        } catch (err) {
            res.status(500).json({
                message: err.message || DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = paymentController
