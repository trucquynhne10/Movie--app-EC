const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        orders: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order'
            }
        ],
        plans: [
            {
                type: Schema.Types.ObjectId,
                ref: 'UserPlan'
            }
        ]
    },
    { timestamps: true }
)

module.exports = model('User', UserSchema)
