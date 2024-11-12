const express = require('express')
const recommendController = require('../controllers/recommendController')

const router = express.Router()

router.get('/', recommendController.getLimitedList)

module.exports = router
