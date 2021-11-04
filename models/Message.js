

const mongoose = require('mongoose')
const messageSchema = mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    createdAt: String
})

const Message  = mongoose.model('Message',messageSchema)
module.exports = Message
