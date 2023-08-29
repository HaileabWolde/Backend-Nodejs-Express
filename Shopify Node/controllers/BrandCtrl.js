const Brand = require('../models/BrandModel')
const {CustomAPIError, UnauthenticatedError, BadRequestError, NotFoundError} = require('../errors/index')
const validateMongodbId = require('../utils/validateMongodbid');

const createBrand = async(req, res)=>{

    try{
        const createdCategory = await Brand.create(req.body)
        res.json(createdCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const UpdateBrand = async (req, res)=>{
    try{
        const {id: UserId} = req.params
        const UpdatedCategory = await Brand.findByIdAndUpdate({_id: UserId}, req.body,
            
                {new: true, runValidators: true})
                res.json({UpdatedCategory})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const GetSingleBrand = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const SingleCategory = await Brand.findById(UserId)
        res.json({SingleCategory})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const GetAllBrand = async (req, res)=>{
    try{
      const queryObject = {...req.query}
        const AllCategory = await Brand.find(queryObject)
        res.json(AllCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const DeleteBrand = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const DeletedCategory = await Brand.findByIdAndDelete(UserId)
        res.json(DeletedCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
module.exports = {
    createBrand, UpdateBrand,
    GetAllBrand, GetSingleBrand,
    DeleteBrand}