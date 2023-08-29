const express = require('express')
const router = express.Router()
const  {createBrand, UpdateBrand,
    GetAllBrand, GetSingleBrand,
    DeleteBrand} = require('../controllers/BrandCtrl')
const { AuthMiddleware,  isAdmin} = require('../middlewares/AuthMiddleware')

router.post('/', AuthMiddleware,  isAdmin, createBrand)
router.get('/all', GetAllBrand)
router.get('/:id', GetSingleBrand)
router.put('/:id',AuthMiddleware, isAdmin, UpdateBrand)
router.delete('/:id',AuthMiddleware, isAdmin, DeleteBrand)

module.exports = router