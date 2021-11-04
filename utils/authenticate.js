
require('dotenv').config()

const User = require('../models/User')
const Room = require('../models/Room')

const jwt = require('jsonwebtoken')

const AUTHENTICATE_HOME = async (context) => {

    const token = await getToken()
    if(!token) return { user: undefined , valid: false }
    const decode = await verifyToken(token)
    if(!decode) return { user: undefined , valid: false }
    const user = await verifyDecode(decode)
    if(!user) return { user: undefined , valid: false }

    return {
        user,
        valid: true
    }

    async function getToken(){
        return context.req.headers.authentication || undefined
    }

    async function verifyToken(token){
        const decode = await jwt.verify(token,process.env.JWT_SECRET,(err,decode) => {
            if(err) {
                return undefined
            }else {
                return decode
            }
        })
        return decode
    }

    async function verifyDecode(decode){
        return User.findById(decode._id)
    }


}


const AUTHENTICATE_ROOM = async (id) => {
    const room = await Room.findById(id)
    return {
        room,
        valid: room ? true : false
    }


}

module.exports = {
    AUTHENTICATE_HOME,
    AUTHENTICATE_ROOM
}
