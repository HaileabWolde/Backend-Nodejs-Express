const express = require('express')
const router = express.Router()
const {CreateCoupon, UpdateCoupon,
    DeletedCoupon,SingleCoupon,
    GetAllCoupon} = require('../controllers/CouponController')
const { AuthMiddleware,  isAdmin} = require('../middlewares/AuthMiddleware')

router.post('/', AuthMiddleware, isAdmin, CreateCoupon)
router.get('/all', GetAllCoupon)
router.get('/:id', SingleCoupon)
router.put('/:id',AuthMiddleware, isAdmin, UpdateCoupon)
router.delete('/:id',AuthMiddleware, isAdmin,  DeletedCoupon)

module.exports = router