const mongoose = require('mongoose')

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Plan', PlanSchema)
