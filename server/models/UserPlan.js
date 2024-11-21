const { Schema, model } = require('mongoose')

const UserPlanSchema = new Schema(
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
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            require: true
        },
        startDate: {
            type: Date,
            require: true
        },
        finishDate: {
            type: Date,
            require: true
        },
        status: {
            type: String,
            enum: ['VALID', 'INVALID'],
            require: true
        }
    },
    { timestamps: true }
)

module.exports = model('UserPlan', UserPlanSchema)
