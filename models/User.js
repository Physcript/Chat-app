
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
    online: {
        type: Boolean,
        default: false
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    loginToken: String,
    verified: Boolean,
    createdAt: String,

})

const User = mongoose.model('User',userSchema)
module.exports = User
