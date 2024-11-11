const mongoose = require('mongoose')

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    price: {
        type: Number,
        require: true
    },
    month: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('Plan', PlanSchema)
