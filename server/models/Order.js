const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        plan: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            required: true
        },
        voucher: {
            type: Schema.Types.ObjectId,
            ref: 'Voucher'
        },
        finalPrice: {
            type: Number,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'CANCELED'],
            default: 'PENDING',
            required: true
        },
        payUrl: String
    },
    { timestamps: true }
)

module.exports = model('Order', OrderSchema)
