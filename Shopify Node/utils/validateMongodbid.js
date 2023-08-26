const mongoose = require('mongoose')
const {UnauthenticatedError} = require('../errors/index')

const validateMongodbId = (id) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid){
        throw new UnauthenticatedError('This Id is not valid or not found')
    }
}

module.exports = validateMongodbId