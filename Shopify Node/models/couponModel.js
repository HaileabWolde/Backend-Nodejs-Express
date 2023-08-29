const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CouponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    expiry:{
        type:String,
        required:true,
    },
    discount:{
        type:String,
        required:true,
        
    }
});

//Export the model
module.exports = mongoose.model('Coupon', CouponSchema);