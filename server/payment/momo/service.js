const axiosIns = require('./axiosIns')
const settings = require('./settings')

const momoService = {
    pay: async ({ amount, orderId, planName }) => {
        const orderInfo = `${planName} plan payment`

        const requestBody = JSON.stringify({
            amount,
            orderId,
            orderInfo,
            requestId: orderId,
            partnerCode: settings.partnerCode,
            partnerName: settings.partnerName,
            storeId: settings.storeId,
            redirectUrl: settings.redirectUrl,
            ipnUrl: settings.ipnUrl,
            lang: settings.lang,
            requestType: settings.requestType,
            autoCapture: settings.autoCapture,
            extraData: settings.extraData,
            orderGroupId: settings.orderGroupId,
            signature: settings.createSignature({ amount, orderId, orderInfo })
        })

        return await axiosIns.post('/v2/gateway/api/create', requestBody)
    }
}

module.exports = momoService
