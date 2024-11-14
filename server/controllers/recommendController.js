const tmdbService = require('../tmdb/service')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'

const recommendController = {
    getLimitedList: async (req, res) => {
        try {
            const { page, language } = req.query

            // Fetch genres
            const genres = await tmdbService.getMediaGenres({
                language,
                mediaType: 'movie'
            })
            const genresMap = []
            genres.data.genres.forEach(({ id, name }) => (genresMap[id] = name))

            // Fetch movie list
            const response = await tmdbService.getLimitedList({
                page,
                language
            })

            // Map each item with gerne names
            const data = response.data.items.map((item) => {
                return {
                    ...item,
                    genre_names: item.genre_ids.map((id) => genresMap[id])
                }
            })

            res.status(200).json({ data: data })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = recommendController
