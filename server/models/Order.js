const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        plan: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            require: true
        },
        voucher: {
            type: Schema.Types.ObjectId,
            ref: 'Voucher'
        },
        finalPrice: {
            type: Number,
            require: true
        },
        method: {
            type: String,
            require: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'CANCELED'],
            default: 'PENDING',
            require: true
        },
        payUrl: String
    },
    { timestamps: true }
)

module.exports = model('Order', OrderSchema)
