

const mongoose = require('mongoose')
const roomSchema = mongoose.Schema({
    name: String,
})

const Room = mongoose.model('Room',roomSchema)
module.exports = Room
