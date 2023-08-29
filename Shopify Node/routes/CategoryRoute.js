const express = require('express')
const router = express.Router()
const  {createCategory, UpdateCategory,
    GetAllCategory, GetSingleCategory,
    DeleteCategory} = require('../controllers/categoryController')
const { AuthMiddleware,  isAdmin} = require('../middlewares/AuthMiddleware')

router.post('/', AuthMiddleware,  isAdmin, createCategory)
router.get('/all', GetAllCategory)
router.get('/:id', GetSingleCategory)
router.put('/:id',AuthMiddleware, isAdmin, UpdateCategory)
router.delete('/:id',AuthMiddleware, isAdmin, DeleteCategory)

module.exports = router