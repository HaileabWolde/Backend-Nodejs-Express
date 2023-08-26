const User = require('../models/userModel')
const JWT = require('jsonwebtoken')
const {UnauthenticatedError, CustomAPIError} = require('../errors/index')

const AuthMiddleware = async(req, res, next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('A token should be provided')
    }

    const token = authHeader.split(' ')[1]
    
    try{
        const payload = JWT.verify(token, process.env.JWT_SECRET)
        const {UserId } = payload
        const user = await User.findById({_id:UserId})
        req.user = user
        next()
   }
   catch(error){
        throw new UnauthenticatedError('Invalid Credentials')
   }
}

const isAdmin = async (req, res, next)=>{
   try{
    const {email} = req.user
    const user = await User.findOne({email})
    if(user.role !== 'Admin'){
        throw new UnauthenticatedError('User is not Admin')
    }
    else{
        next()
    }
   }
   catch(error){
    throw new CustomAPIError(error, 404)
   }
}

module.exports ={
    AuthMiddleware,
    isAdmin
}