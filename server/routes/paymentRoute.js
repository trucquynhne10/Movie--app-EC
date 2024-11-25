const express = require('express')
const { verifyJWT } = require('../middlewares/verifyJWT')
const paymentController = require('../controllers/paymentController')

const router = express.Router()

router.post('/', verifyJWT, paymentController.createPayment)
router.post('/callback', paymentController.callback)
router.get('/pending', verifyJWT, paymentController.getPendingPayment)
router.post('/apply-voucher', verifyJWT, paymentController.applyVoucher)

module.exports = router
