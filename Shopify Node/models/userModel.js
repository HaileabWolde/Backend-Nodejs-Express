const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: 'User'
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    cart:{
        type: Array,
        default: []
    },
   address: [{type: mongoose.Schema.Types.ObjectId, ref: 'Address'}],
    wishList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}] ,

    refreshToken:{
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
    timestamps: true
}
   );

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.RefreshToken =  function(){
    return  JWT.sign({
        UserId: this._id, Email: this.email
    }, process.env.JWT_SECRET, {expiresIn: '3d'})
}

userSchema.methods.createJWT =   function(){
    return  JWT.sign({
        UserId: this._id, Email: this.email
    }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

userSchema.methods.isPasswordmatched = async function(pass){
return await bcrypt.compare(pass, this.password)
}

userSchema.methods.createPasswordResetToken = async function(){
    const resettoken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.
    createHash('sha256')
    .update(resettoken)
    .digest9('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 *1000
    return resettoken
}

//Export the model
module.exports = mongoose.model('User', userSchema);