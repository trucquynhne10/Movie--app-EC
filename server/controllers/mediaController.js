const tmdbService = require('../tmdb/service')
const User = require('../models/User')
const Review = require('../models/Review')
const Favorite = require('../models/Favorite')
const verifyTokenMiddleware = require('../middlewares/verifyJWT')
const recommendService = require('../services/recommendService')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const mediaController = {
    getMediaList: async (req, res) => {
        try {
            const { page } = req.query
            const { mediaType, mediaCategory } = req.params
            const language = req.query.language ?? 'en-US'

            const response = await tmdbService.getMediaList({
                mediaType,
                mediaCategory,
                page,
                language
            })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getGenres: async (req, res) => {
        try {
            const { mediaType } = req.params
            const language = req.query.language ?? 'en-US'

            const response = await tmdbService.getMediaGenres({
                mediaType,
                language: language
            })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    searchMedia: async (req, res) => {
        try {
            const { mediaType } = req.params
            const { query, page } = req.query
            const language = req.query.language ?? 'en-US'

            const response = await tmdbService.getMediaSearch({
                query,
                page,
                mediaType: mediaType === 'people' ? 'person' : mediaType,
                language
            })

            res.status(200).json({ data: response?.data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getMediaDetail: async (req, res) => {
        try {
            const { mediaType, mediaId } = req.params
            const mediaParams = { mediaType, mediaId }
            const language = req.query.language ?? 'en-US'

            const { data: media } = await tmdbService.getMediaDetail({
                ...mediaParams,
                language: language
            })

            const credits = await tmdbService.getMediaCredits(mediaParams)
            const videos = await tmdbService.getMediaVideos(mediaParams)
            const recommend = await recommendService.fetchSimilarFilms(
                media.id,
                media.title || media.name,
                media.genres.map((obj) => obj.name),
                language
            )

            const images = await tmdbService.getMediaImages(mediaParams)

            media.credits = credits?.data
            media.videos = videos?.data
            media.recommend = recommend
            media.images = images?.data
            media.reviews = await Review.find({ mediaId })
                .populate('user')
                .sort({ createdAt: -1 })

            // Additional information if user logged in
            const decodedUserId = verifyTokenMiddleware.decodeToken(req)
            if (decodedUserId) {
                const user = await User.findById(decodedUserId)
                if (user) {
                    const isFavorite = await Favorite.findOne({
                        user: user._id,
                        mediaId
                    })
                    media.isFavorite = isFavorite !== null
                }
            }

            res.status(200).json({ data: media })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = mediaController
