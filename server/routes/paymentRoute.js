const express = require('express')
const { verifyJWT } = require('../middlewares/verifyJWT')
const paymentController = require('../controllers/paymentController')

const router = express.Router()

router.post('/momo', verifyJWT, paymentController.payWithMomo)
router.post('/callback', paymentController.callback)
router.get('/pending', verifyJWT, paymentController.getPendingPayment)

module.exports = router
