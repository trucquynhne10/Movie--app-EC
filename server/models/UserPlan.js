const { Schema, model } = require('mongoose')

const UserPlanSchema = new Schema(
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
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        finishDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['VALID', 'INVALID'],
            required: true
        }
    },
    { timestamps: true }
)

module.exports = model('UserPlan', UserPlanSchema)
