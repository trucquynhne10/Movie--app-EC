const tmdbBaseUrl = process.env.TMDB_BASE_URL
const tmdbApiKey = process.env.TMDB_API_KEY

const generateURL = (endpoint, queryParams) => {
    const queries = new URLSearchParams(queryParams)

    return `${tmdbBaseUrl}/${endpoint}?api_key=${tmdbApiKey}&${queries}`
}

const tmdbEndpoints = {
    mediaList: ({ mediaType, mediaCategory, page, language }) =>
        generateURL(`${mediaType}/${mediaCategory}`, { page, language }),

    mediaDetail: ({ mediaType, mediaId, language }) =>
        generateURL(`${mediaType}/${mediaId}`, { language }),

    mediaGenres: ({ mediaType, language }) =>
        generateURL(`genre/${mediaType}/list`, { language }),

    mediaCredits: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/credits`),

    mediaVideos: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/videos`),

    mediaRecommend: ({ mediaType, mediaId, language }) =>
        generateURL(`${mediaType}/${mediaId}/recommendations`, { language }),

    mediaImages: ({ mediaType, mediaId }) =>
        generateURL(`${mediaType}/${mediaId}/images`),

    mediaSearch: ({ mediaType, query, page, language }) =>
        generateURL(`search/${mediaType}`, { query, page, language }),

    personDetail: ({ personId, language }) =>
        generateURL(`person/${personId}`, { language }),

    personMedias: ({ personId, language }) =>
        generateURL(`person/${personId}/combined_credits`, { language }),

    limitedList: ({ page, language }) =>
        generateURL(`list/${process.env.DEFAULT_LIST_ID}`, { page, language })
}

module.exports = tmdbEndpoints
