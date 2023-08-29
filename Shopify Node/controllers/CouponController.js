const Coupon = require('../models/couponModel')
const {CustomAPIError,  BadRequestError} = require('../errors/index')
const validateMongodbId = require('../utils/validateMongodbid');


const CreateCoupon = async(req, res)=>{
  try { 
        const CreatedCoupon = await Coupon.create(req.body)
        res.json({CreatedCoupon})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
    
}
const UpdateCoupon = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const UpdatedCoupon = await Coupon.findByIdAndUpdate({_id: UserId}, req.body,
            
                {new: true, runValidators: true})
                res.json({UpdatedCoupon})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
const GetAllCoupon = async (req,res)=>{
    try{
        const queryObject = {...req.query}
          const AllCategory = await Coupon.find(queryObject)
          res.json(AllCategory)
      }
      catch(error){
          throw new CustomAPIError(error, 404)
      }
}

const SingleCoupon = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const SingleCategory = await Coupon.findById(UserId)
        res.json({SingleCategory})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
const DeletedCoupon = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const DeletedCategory = await Coupon.findByIdAndDelete(UserId)
        res.json(DeletedCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
module.exports = {
    CreateCoupon,UpdateCoupon,
    DeletedCoupon,SingleCoupon,
    GetAllCoupon
}