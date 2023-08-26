const User = require('../models/userModel')
const {StatusCodes} = require('http-status-codes')
const  SendEmail = require('./emailController')
const {CustomAPIError, UnauthenticatedError, BadRequestError, NotFoundError} = require('../errors/index');
const validateMongodbId = require('../utils/validateMongodbid');
const JWT = require('jsonwebtoken')
//const {StatusCodes} = require('http-status-codes')
const createUser = async (req, res) => {
    try {
      const { email } = req.body;
  
      const findEmail = await User.findOne({ email: email });
  
      if (!findEmail) {
        const newUser = await User.create(req.body);
        const token = newUser.createJWT();
        res.json({ newUser, token });
      } else {
        throw new CustomAPIError("User Already Existed", 409);
      }
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };
const loginUser = async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError("Please Provide appropriate credentials")
    }
    const findEmail = await User.findOne({email: email})
    const {_id} = findEmail

    if(findEmail && await findEmail.isPasswordmatched(password)){
        const RefreshToken = await findEmail.RefreshToken()
        const UpdatedUser = await User.findByIdAndUpdate({
            _id
        }, {
            refreshToken: RefreshToken
        }, {new: true, runValidators: true})

        res.cookie('refreshToken', RefreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 *1000,
        })

        const token = findEmail.createJWT()
        res.status(StatusCodes.OK).json({findEmail, token})
    }
    else{
        throw new UnauthenticatedError('Invalid Credinetials')
    }
}
const getAllUser = async(req, res)=>{
    try{
        const AllUser = await User.find()
        res.json(AllUser)
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}
const getSingleUser = async (req, res)=>{
    const {id:UserId} = req.params

    validateMongodbId(UserId)
    try{
        const SingleUser = await User.findById({_id:UserId})
        res.json({SingleUser})
    }
    catch(error){
        throw new CustomAPIError(error, 401)
    }
}
const DeleteUser = async(req, res)=>{
const {id: UserId} = req.params
validateMongodbId(UserId)
try{
    const DeletedUser = await User.findByIdAndDelete({_id: UserId})
    res.json({DeletedUser})
}
catch(error){
    throw new CustomAPIError(error, 401)
}
}

/*const handleRefreshToken = async (req, res)=>
{
    const cookie =  req.cookies
    if(!cookie.refreshToken){
        throw new BadRequestError('No Refresh Token in Cookies')
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken})
    if(!user){
        throw new UnauthenticatedError('no Refresh token present in db or not matched')
    }
    JWT.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        if(err || user.id !== decoded.id){
            throw new UnauthenticatedError('There is something wrong with refresh token')
        }
        const accessToken = user.createJWT()
        res.json({accessToken})
    })


}*/
const UpdateUser = async (req, res)=>{
    const {
        user:{_id: UserId},
        body: {email, password, firstname, lastname, mobile}
    } = req

    validateMongodbId(UserId)

    if (email === '' || password === '' || firstname === '' || lastname === '' || mobile === ''){
        throw new BadRequestError("Please fill the form approiately")
    }

    const UpdatedUser = await User.findByIdAndUpdate({_id: UserId}, req.body,
        {new: true, runValidators: true} )
    
    if(!UpdateUser){
        throw new NotFoundError(`No user  is registerd by id ${UserId}`)
    }
    res.json({UpdatedUser})
}

const BlockUser = async (req, res)=>{
const {id:UserId} = req.params
validateMongodbId(UserId)
try{
    const Block = await User.findByIdAndUpdate({_id:UserId},
        {
            isBlocked: true
        },{new: true, runValidators: true} )
        res.json({mgs: 'User is Blocked'})
}
catch(error){
    throw new CustomAPIError(error, 404)
}
}

const UnBlockUser = async (req, res)=>{
    const {id:UserId} = req.params
    validateMongodbId(UserId)
    try{
        const Block = await User.findByIdAndUpdate({_id:UserId},
            {
                isBlocked: true
            },{new: true, runValidators: true} )
            res.json({msg: 'User is UnBlocked'})
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
}

const UpdatePassword = async(req, res)=>{
    const {password} = req.body
   
    const {_id: UserId} = req.user
    validateMongodbId(UserId)
    try{
        const UserOne = await User.findById(UserId)
        if(password){
            UserOne.password = password
            const  UpdatedPassword = await UserOne.save()
            res.json(UpdatedPassword)
        }
        else{
            res.json(UserOne)
        }
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }
   
    
}
const forgetPasswordToken = async(req, res)=>{
    const {email} = req.body
    const user = await User.findOne({email: email})
    if (!user){
        throw new UnauthenticatedError('User not foung with this email')
    }
    try{
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, please follow this link to reset your password <a href='http://localhost:5000/api/user/reset-password/${token}'>Clickhere</>`
        const data = {
            to: email,
            text: 'Hey User',
            subject: 'forget Password Link',
            htm: resetURL
        }
        SendEmail(data)
        res.json(token);
    }
    catch(error){
        throw new CustomAPIError(error, 404)
    }

}
/*
const logout = async(req, res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshToken){
        throw new BadRequestError('No Refresh Token in cookie')
    }
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.status(204)
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204)
}
*/
module.exports = {
    createUser,loginUser,
    getAllUser,getSingleUser,
    DeleteUser,UpdateUser,
    BlockUser,UnBlockUser,
    UpdatePassword,
    forgetPasswordToken
    //handleRefreshToken,
    //logout
}