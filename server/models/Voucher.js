const { Schema, model } = require('mongoose')

const VoucherSchema = new Schema(
    {
        groupName: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['PERCENT', 'NUMBER'],
            required: true
        },
        quantity: Number,
        description: String,
        expiredDate: Date
    },
    { timestamps: true }
)

module.exports = model('Voucher', VoucherSchema)
