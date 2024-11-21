const axios = require('axios')

const axiosIns = axios.create({
    baseURL: 'https://test-payment.momo.vn',
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosIns.interceptors.request.use(
    (config) => {
        if (config.data) {
            const dataString =
                typeof config.data === 'string' || config.data instanceof String
                    ? config.data
                    : JSON.stringify(config.data)
            config.headers['Content-Length'] = Buffer.byteLength(dataString)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

module.exports = axiosIns
