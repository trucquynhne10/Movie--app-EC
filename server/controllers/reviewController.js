const Review = require('../models/Review')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const reviewController = {
    addReview: async (req, res) => {
        try {
            const { movieId } = req.params

            const newReview = await Review.create({
                ...req.body,
                user: req.userId,
                movieId
            })

            res.status(201).json({
                message: 'New review added',
                data: newReview
            })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    removeReview: async (req, res) => {
        try {
            const { reviewId } = req.params

            const deletedReview = await Review.findOneAndDelete({
                _id: reviewId,
                user: req.userId
            })
            if (!deletedReview) {
                return res.status(401).json({ message: 'Review not found' })
            }

            res.status(200).json({ message: 'Review deleted successfully' })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getUserReviews: async (req, res) => {
        try {
            const reviews = await Review.find({ user: req.userId })
                .populate('user')
                .sort({
                    createdAt: -1
                })

            res.status(200).json({ data: reviews })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = reviewController
