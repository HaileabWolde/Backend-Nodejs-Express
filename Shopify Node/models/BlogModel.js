const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    NumViews:{
        type:String,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked:{
        type: Boolean,
        default: false
    },
    Likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    Dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    image: {
        type: String,
        default: "https://img.freepik.com/free-photo/online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg"
    },
    author: {
        type: String,
        default: 'Admin'
    },

}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', BlogSchema);