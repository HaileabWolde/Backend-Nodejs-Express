const Blog = require('../models/BlogModel')
const  User = require('../models/userModel')
const {CustomAPIError, UnauthenticatedError, BadRequestError, NotFoundError} = require('../errors/index')
const validateMongodbId = require('../utils/validateMongodbid');

const CreateBlog = async (req, res)=>{
    try{
        const BlogCreated = await Blog.create(req.body)
        res.json({BlogCreated})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
  
}

const UpdateBlog = async (req, res)=>{
    try{
        const {id: UserId} = req.params
        const UpdatedBlog = await Blog.findByIdAndUpdate({_id: UserId}, req.body,
            
                {new: true, runValidators: true})
                res.json({UpdatedBlog})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const GetSingleBlog = async (req, res)=>{
    try{
        const {id: UserId} = req.params
        const SingleBlog = await Blog.findById(UserId).
        populate('Likes').populate('Dislikes')
        res.json({SingleBlog})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const GetAllBlog = async (req, res)=>{
    try{
      const queryObject = {...req.query}
        const AllBlog = await Blog.find(queryObject)
        res.json(AllBlog)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const DeleteBlog = async(req,res)=>{
    try{
        const {id: UserId} = req.params
        const DeletedBlog = await Blog.findByIdAndDelete(UserId)
        res.json(DeletedBlog)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
const likeBlog = async(req, res)=>{
    const {blogId} = req.body
    validateMongodbId(blogId)
    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    //find the login user
    const loginUserId = req?.user?._id;
    //find if the user has like the blog
    const isLiked = blog?.isLiked;
    //find if the user has disliked the blog
    const alreadyDisliked = blog?. Dislikes?.find(
        (userId)=>  userId?.toString()=== loginUserId?.toString())
    
    if (alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
              $pull: {  Dislikes: loginUserId},
              isDisliked: false,  
            },
            {new: true, runValidators: true}
        )
        res.json(blog)
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { Likes: loginUserId},
                isliked: false
            },
            {new: true, runValidators: true}
        )
        res.json(blog)
    }
    else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { Likes: loginUserId},
                isLiked: true
            },
            {new: true, runValidators: true}

        )
        res.json(blog)
    }
}
const Dislike = async (req, res) => {
    const { blogId } = req.body;
  
    // Find the blog which you want to dislike
    const blog = await Blog.findById(blogId);
  
    // Find the login user
    const loginUserId = req?.user?._id;
  
    // Check if the user has liked the blog
    const alreadyLiked = blog?.Likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
  
    if (alreadyLiked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { Likes: loginUserId },
          isLiked: false,
        },
        { new: true, runValidators: true }
      );
      res.json(updatedBlog);
    }
  
    if (blog.isDisliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { Dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true, runValidators: true }
      );
      res.json(updatedBlog);
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { Dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true, runValidators: true }
      );
      res.json(updatedBlog);
    }
  };
module.exports = {
    CreateBlog, UpdateBlog,
    GetSingleBlog, GetAllBlog,
    DeleteBlog, likeBlog,
    Dislike
}