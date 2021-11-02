

require('dotenv').config()
const jwt = require('jsonwebtoken')

const GENERATE_LOGIN_TOKEN = async (data) => {

    const token = await jwt.sign({ _id: data._id },process.env.JWT_SECRET)
    return token


}

module.exports = {
    GENERATE_LOGIN_TOKEN,
}
