const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        mediaType: {
            type: String,
            enum: ['tv', 'movie'],
            required: true
        },
        mediaId: {
            type: String,
            required: true
        },
        mediaTitle: {
            type: String,
            required: true
        },
        mediaPoster: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Review', ReviewSchema)
