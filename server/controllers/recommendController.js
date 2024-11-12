const tmdbService = require('../tmdb/service')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const recommendController = {
    getLimitedList: async (req, res) => {
        try {
            const { page, language } = req.query

            const response = await tmdbService.getLimitedList({
                page,
                language
            })

            res.status(200).json({ data: response.data.items })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = recommendController
