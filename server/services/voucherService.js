const Order = require('../models/Order')
const Voucher = require('../models/Voucher')
const User = require('../models/User')

const voucherService = {
    createPromoCode: async ({ resultCode, orderId }) => {
        if (resultCode !== 0) return

        const { user } = await Order.findById(orderId).populate({
            path: 'user',
            select: 'username fullName'
        })

        // Return if user has paid orders before
        if (await hasOrderedBefore(user._id)) return

        await Voucher.create({
            groupName: process.env.PROMO_VOUCHER_GROUP_NAME,
            code: user.username,
            amount: process.env.PROMO_VOUCHER_AMOUNT,
            type: process.env.PROMO_VOUCHER_TYPE,
            description: `${process.env.PROMO_VOUCHER_DES} ${user.fullName}`
        })
    },

    applyVoucher: async ({ voucherCode, price, userId }) => {
        let finalPrice, discountAmount
        const voucher = await Voucher.findOne({ code: voucherCode })

        // Validate voucher existence
        if (!voucher) return { statusCode: 404, message: 'Voucher not found' }

        // Validate user first time use if voucher is promo code
        if (
            voucher.groupName === process.env.PROMO_VOUCHER_GROUP_NAME &&
            (await hasOrderedBefore(userId))
        )
            return {
                statusCode: 400,
                message: 'Promo code can only use at first time buy'
            }

        if (voucher.type === 'PERCENT') {
            discountAmount = price * voucher.amount
        }

        if (voucher.type === 'NUMBER') {
            discountAmount = voucher.amount
        }

        return {
            data: {
                amount: voucher.amount,
                type: voucher.type,
                description: voucher.description,
                finalPrice: price - discountAmount,
                discountAmount,
                price
            }
        }
    }
}

const hasOrderedBefore = async (userId) => {
    const result = await User.findById(userId).populate({
        path: 'orders',
        match: { status: 'PAID' }
    })

    // Return if user has paid orders before
    if (result.orders && result.orders?.length > 0) return result

    return false
}

module.exports = voucherService
