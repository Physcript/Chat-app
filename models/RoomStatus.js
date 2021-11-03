

const mongoose = require('mongoose')
const roomStatusSchema = mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const RoomStatus = mongoose.model('RoomStatus',roomStatusSchema)
module.exports = RoomStatus
