const { Schema, model } = require('mongoose')

const VoucherSchema = new Schema(
    {
        groupName: {
            type: String,
            require: true
        },
        code: {
            type: String,
            require: true
        },
        amount: {
            type: Number,
            require: true
        },
        type: {
            type: String,
            enum: ['PERCENT', 'NUMBER'],
            require: true
        },
        quantity: Number,
        description: String,
        expiredDate: Date
    },
    { timestamps: true }
)

module.exports = model('Voucher', VoucherSchema)
