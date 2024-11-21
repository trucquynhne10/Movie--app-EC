require('dotenv')
const crypto = require('crypto')

const settings = {
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    partnerCode: process.env.MOMO_PARTNER_CODE,
    redirectUrl: process.env.MOMO_REDIRECT_URL,
    ipnUrl: process.env.MOMO_IPN_URL,
    requestType: process.env.MOMO_REQUEST_TYPE,
    extraData: process.env.MOMO_EXTRA_DATA || '',
    orderGroupId: process.env.MOMO_ORDER_GROUP_ID || '',
    autoCapture: process.env.MOMO_AUTO_CAPTURE,
    storeId: process.env.MOMO_STORE_ID,
    partnerName: process.env.MOMO_PARTNER_NAME,
    lang: process.env.MOMO_LANG
}

module.exports = {
    ...settings,
    createSignature: ({ amount, orderId, orderInfo }) => {
        const rawSignature =
            'accessKey=' +
            settings.accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            settings.extraData +
            '&ipnUrl=' +
            settings.ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            settings.partnerCode +
            '&redirectUrl=' +
            settings.redirectUrl +
            '&requestId=' +
            orderId +
            '&requestType=' +
            settings.requestType

        return crypto
            .createHmac('sha256', settings.secretKey)
            .update(rawSignature)
            .digest('hex')
    }
}
