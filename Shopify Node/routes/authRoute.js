const express = require('express')
const router = express.Router()
const {createUser, loginUser,  getAllUser,  
    getSingleUser, DeleteUser, UpdateUser, 
    UnBlockUser, BlockUser, handleRefreshToken, 
    UpdatePassword, logout, 
    forgetPasswordToken, loginAdmin,
    wishlist, useCart,
    OneCart,  RemoveCart} = require('../controllers/userController')
const { AuthMiddleware,  isAdmin} = require('../middlewares/AuthMiddleware')

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/Admin-login', loginAdmin)
router.get('/AllUser', getAllUser)
router.get('/wishList', AuthMiddleware, wishlist)
router.post('/useCart', AuthMiddleware, useCart)
router.get('/getCart', AuthMiddleware, OneCart)
router.delete('/DELETECart', AuthMiddleware,  RemoveCart)
router.get('/:id', AuthMiddleware, getSingleUser)

router.delete('/:id', DeleteUser)

router.patch('/edit-user',AuthMiddleware,  UpdateUser)
router.patch('/block-user/:id', AuthMiddleware, isAdmin,BlockUser)
router.patch('/unblock-user/:id', AuthMiddleware, isAdmin, UnBlockUser)
router.patch('/UpdatePassword', AuthMiddleware, UpdatePassword )
router.post('/forget-password-token', forgetPasswordToken)

/*router.get('/RefreshToken', handleRefreshToken)
router.get('/logout', logout)*/
module.exports = router