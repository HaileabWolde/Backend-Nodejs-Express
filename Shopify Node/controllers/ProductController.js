const Product = require('../models/ProductModel')
const User = require('../models/userModel')
const {CustomAPIError, UnauthenticatedError, 
    BadRequestError, NotFoundError} = require('../errors/index');

const slugify = require('slugify')
const createProduct = async (req, res) => {
    let { title, slug } = req.body;
    try {
      if (!slug && title) {
        slug = slugify(title);
      }
      const newProduct = await Product.create({ title, slug, ...req.body });
      res.json({ newProduct });
    } catch (error) {
      throw new CustomAPIError(error, 404);
    }
  };

const getSingleProduct = async (req, res)=>{
    try{
        const {id:UserId} = req.params
        const SingleProduct = await Product.findById(UserId)
        res.json({SingleProduct})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const allProduct = async (req, res)=>{
  
    try{
      //filtering
      const queryObject = {...req.query}
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((el)=> delete queryObject[el])

      let queryStr = JSON.stringify(queryObject);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`)
      let query = Product.find(JSON.parse(queryStr))

      //sorting
      if(req.query.sort){
        const sortBy = req.query.sort.split(" ,").join(" ");
        query = query.sort(sortBy)
      }
      else{
        query = query.sort("-createdAt")
      }

      //selecting of field
        if(req.query.fields){
          const fields = req.query.fields.split(',').join(" ")
          query = query.select(fields)
        }
       
      // pagination
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
      const skip = (page - 1) * limit
      query = query.skip(skip).limit(limit)
      if (req.query.page){
        const productCount = await Product.countDocuments()
        if(skip >= productCount){
          throw new CustomAPIError('this page does not exist')
        }
      }
        const AllProduct = await query
        res.json({AllProduct})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const UpdateProduct = async(req, res)=>{
    let { title, slug } = req.body;
    try{
        if (!slug && title) {
            slug = slugify(title);
          }
        const {id:UserId} = req.params 
        const UpdateProduct = await Product.findByIdAndUpdate({
            _id: UserId
        }, req.body,  {new: true, runValidators: true}
        )
        res.json({UpdateProduct})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const DeleteProduct = async (req, res) => {
    try {
      const { id: UserId } = req.params;
      
      // Verify if the product exists before deleting
      const product = await Product.findById(UserId);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      
      const deletedProduct = await Product.findByIdAndDelete(UserId);
      res.json({ deletedProduct });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      throw new CustomAPIError('Failed to delete product', 500);
    }
  }

  const addedWishList = async (req, res) => {
    try {
      const { product_id } = req.body;
      const { _id: UserId } = req.user;
  
      const user = await User.findById(UserId);
  
      const alreadyWishListed = user.wishList.find((productId) => productId.toString() === product_id.toString());
  
      if (alreadyWishListed) {
        const updatedWishList = await User.findByIdAndUpdate(
          UserId,
          { $pull: { wishList: product_id } },
          { new: true, runValidators: true }
        );
        res.json(updatedWishList);
      } else {
        const updatedWishList = await User.findByIdAndUpdate(
          UserId,
          { $push: { wishList: product_id } },
          { new: true, runValidators: true }
        );
        res.json(updatedWishList);
      }
    } catch (error) {
      throw new CustomAPIError(error, 404);
    }
  };

  const rating = async (req, res) => {
    try {
      const { rating_id, star } = req.body;
      const { _id: UserId } = req.user;
  
      const product = await Product.findById(rating_id);
  
      const ratedProduct = product.ratings.find((ratingId) => ratingId.postedby.toString() === UserId.toString());
  
      if (ratedProduct) {
        const updateRating = await Product.updateOne(
          { 'ratings._id': ratedProduct._id },
          { $set: { 'ratings.$.star': star } },
          { new: true, runValidators: true }
        );
        res.json(updateRating);
      } else {
        const rate = await Product.findByIdAndUpdate(
          rating_id,
          {
            $push: {
              ratings: {
                star: star,
                postedby: UserId,
              },
            },
          },
          { new: true, runValidators: true }
        );
        res.json(rate);
      }
    } catch (error) {
      throw new CustomAPIError(error, 404);
    }
  };

module.exports = {
    createProduct,
    DeleteProduct,
    UpdateProduct,
    allProduct,
    getSingleProduct,
    addedWishList,
    rating
}