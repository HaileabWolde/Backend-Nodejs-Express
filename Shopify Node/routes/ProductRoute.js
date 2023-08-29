const express = require('express')
const router = express.Router()
const {createProduct, DeleteProduct,
    UpdateProduct,allProduct,
    getSingleProduct,  addedWishList,
    rating} = require('../controllers/ProductController')
const { AuthMiddleware,  isAdmin} = require('../middlewares/AuthMiddleware')


router.get('/', AuthMiddleware, isAdmin, createProduct)
router.patch('/:id', AuthMiddleware, isAdmin, UpdateProduct)
router.delete('/:id', AuthMiddleware, isAdmin, DeleteProduct)
router.get('/all',  allProduct)
router.get('/:id', getSingleProduct)
router.put('/wishlist', AuthMiddleware,  addedWishList)
router.put('/rating', AuthMiddleware, rating) 

module.exports = router