const express = require('express')
const { verifyJWT } = require('../middlewares/verifyJWT')
const userController = require('../controllers/userController')
const favoriteController = require('../controllers/favoriteController')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/change-password', verifyJWT, userController.changePassword)
router.get('/info', verifyJWT, userController.getInfo)

router.get('/favorites', verifyJWT, favoriteController.getUserFavorites)
router.post('/favorites', verifyJWT, favoriteController.addToFavorite)
router.delete(
    '/favorites/:favoriteId',
    verifyJWT,
    favoriteController.removeFromFavorite
)

router.get('/orders', verifyJWT, userController.getAllOrders)
router.get('/orders/:orderId', verifyJWT, userController.getOrder)
router.get('/membership', verifyJWT, userController.getMembership)

module.exports = router
