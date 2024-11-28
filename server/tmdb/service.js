const axiosIns = require('../libs/axios')
const tmdbEndpoints = require('./endpoints')

const tmdbService = {
    getMediaList: async ({
        mediaType,
        mediaCategory,
        page,
        language = 'en-US'
    }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaList({
                mediaType,
                mediaCategory,
                page,
                language
            })
        ),

    getMediaDetail: async ({ mediaType, mediaId, language = 'en-US' }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaDetail({ mediaType, mediaId, language })
        ),

    getMediaGenres: async ({ mediaType, language = 'en-US' }) =>
        await axiosIns.get(tmdbEndpoints.mediaGenres({ mediaType, language })),

    getMediaCredits: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaCredits({ mediaType, mediaId })),

    getMediaVideos: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaVideos({ mediaType, mediaId })),

    getMediaImages: async ({ mediaType, mediaId }) =>
        await axiosIns.get(tmdbEndpoints.mediaImages({ mediaType, mediaId })),

    getMediaRecommend: async ({ mediaType, mediaId, language = 'en-US' }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaRecommend({ mediaType, mediaId, language })
        ),

    getMediaSearch: async ({ mediaType, query, page, language = 'en-US' }) =>
        await axiosIns.get(
            tmdbEndpoints.mediaSearch({ mediaType, query, page, language })
        ),

    getPersonDetail: async ({ personId, language = 'en-US' }) =>
        await axiosIns.get(tmdbEndpoints.personDetail({ personId, language })),

    getPersonMedias: async ({ personId, language = 'en-US' }) =>
        await axiosIns.get(tmdbEndpoints.personMedias({ personId, language })),

    getLimitedList: async ({ page, language = 'en-US' }) =>
        await axiosIns.get(tmdbEndpoints.limitedList({ page, language }))
}

module.exports = tmdbService
