const axios = require('axios')
const tmdbService = require('../tmdb/service')

const getFilmDetailsFromIds = async (ids, language) => {
    const filmDetailsPromises = ids.map((id) =>
        tmdbService
            .getMediaDetail({
                mediaType: 'movie',
                mediaId: id,
                language
            })
            .then((res) => res.data)
            .catch((err) => {
                console.error(
                    `Error fetching movie with ID ${id}:`,
                    err.message
                )
                return null
            })
    )

    const filmDetails = await Promise.all(filmDetailsPromises)
    return filmDetails.filter((film) => film !== null) 
}

const MODEL_SERVER_ENDPOINT = 'http://127.0.0.1:5002'

const fetchPredictSVD = async (userId, language) => {
    try {
        const { data: recommendedIds } = await axios.get(
            `${MODEL_SERVER_ENDPOINT}/predictSVD`,
            {
                params: {
                    user_id: userId
                }
            }
        )

        if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
            return []
        }

        const films = await getFilmDetailsFromIds(recommendedIds, language)
        return films
    } catch (error) {
        console.error('Error fetching recommendations:', error.message)
        return []
    }
}

const fetchSimilarFilms = async (filmId, filmTitle, filmGenres, language) => {
    try {
        const { data: similarFilmIds } = await axios.get(
            `${MODEL_SERVER_ENDPOINT}/similarFilms`,
            {
                params: {
                    id: filmId,
                    title: filmTitle,
                    genre_names: JSON.stringify(filmGenres)
                }
            }
        )

        if (!Array.isArray(similarFilmIds) || similarFilmIds.length === 0) {
            return []
        }

        const films = await getFilmDetailsFromIds(similarFilmIds, language)
        return films
    } catch (error) {
        console.error('Error fetching similar films:', error.message)
        return []
    }
}

module.exports = {
    fetchPredictSVD,
    fetchSimilarFilms
}
