const express = require('express')
const planController = require('../controllers/planController')

const router = express.Router()

router.get('/', planController.getPlans)

module.exports = router
