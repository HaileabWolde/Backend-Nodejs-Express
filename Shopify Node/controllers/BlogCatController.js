const BCategory = require('../models/BlogCatModel')
const {CustomAPIError, UnauthenticatedError, 
    BadRequestError, NotFoundError} = require('../errors/index')
const validateMongodbId = require('../utils/validateMongodbid');

const createCategory = async(req, res)=>{

    try{
        const createdCategory = await BCategory.create(req.body)
        res.json(createdCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const UpdateCategory = async (req, res)=>{
    try{
        const {id: UserId} = req.params
        const UpdatedCategory = await BCategory.findByIdAndUpdate({_id: UserId}, req.body,
            
                {new: true, runValidators: true})
                res.json({UpdatedCategory})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const GetSingleCategory = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const SingleCategory = await BCategory.findById(UserId)
        res.json({SingleCategory})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const GetAllCategory = async (req, res)=>{
    try{
      const queryObject = {...req.query}
        const AllCategory = await BCategory.find(queryObject)
        res.json(AllCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const DeleteCategory = async(req, res)=>{
    try{
        const {id: UserId} = req.params
        const DeletedCategory = await BCategory.findByIdAndDelete(UserId)
        res.json(DeletedCategory)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
module.exports = {
    createCategory, UpdateCategory,
    GetAllCategory, GetSingleCategory,
    DeleteCategory}