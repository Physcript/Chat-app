
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        trim: true
    },
    displayName: {
        type: String,
        trim: true
    },
    image: String,
    loginToken: String,
    verified: Boolean,
    createdAt: String,

})

const User = mongoose.model('User',userSchema)
module.exports = User
