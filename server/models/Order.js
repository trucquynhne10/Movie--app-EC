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
        finalPrice: {
            type: Number,
            require: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'CANCELED'],
            default: 'PENDING',
            require: true
        }
    },
    { timestamps: true }
)

module.exports = model('Order', OrderSchema)
