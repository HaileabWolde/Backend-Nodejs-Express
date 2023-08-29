const express = require('express')
const router = express.Router()
const {  CreateBlog, UpdateBlog, 
    GetSingleBlog, GetAllBlog,  
    DeleteBlog, likeBlog,
    Dislike} = require('../controllers/BlogCtrl')
const { AuthMiddleware,  isAdmin} = require('../middlewares/AuthMiddleware')

router.get('/all', GetAllBlog); // Place the '/all' route before the '/:id' route
router.get('/:id', GetSingleBlog);
router.post('/createBlog', AuthMiddleware, isAdmin, CreateBlog);
router.put('/likes', AuthMiddleware, isAdmin, likeBlog)
router.post('/:id', AuthMiddleware, isAdmin, UpdateBlog);
router.delete('/:id',AuthMiddleware, isAdmin,   DeleteBlog)
router.put('/likes', AuthMiddleware, isAdmin, likeBlog)
router.post('/dislikes', AuthMiddleware, isAdmin, Dislike)

module.exports = router

