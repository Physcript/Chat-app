
const User = require('../models/User')
const validator = require('validator')
const bcrypt = require('bcrypt')

const CREATE_USER_VALIDATION = async (email,password,confirmPassword,displayName) => {
    const errors = {}

    await validateEmail(email)
    await validateDisplayName(displayName)
    validatePassword(password,confirmPassword)

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }


    async function validateEmail(email) {
        const isValid = validator.isEmail(email)
        if(!isValid){
            errors.email = 'Invalid email'
            return
        }
        const user = await User.findOne({email})
        if(user) {
            errors.email = 'Email already taken'
        }
    }

    async function validatePassword(password,confirmPassword) {

        if(password.trim() == ''){
            errors.password = 'Password required'
            errors.confirmPassword = 'Password required'
        }else if(password.length <= 5) {
            errors.password = 'Password minimum 6 letters'
            errors.confirmPassword = 'Password minimum 6 letters'
        }else if(password !== confirmPassword){
            errors.password = 'Password not match'
            errors.confirmPassword = 'Password not match'
        }

    }

    async function validateDisplayName(displayName) {

        const user = await User.findOne({displayName})

        if(displayName.trim() == '') {
            errors.displayName = 'display name required'
        }

        if(user) {
            errors.displayName = 'Display name already exist'
        }


    }

}

const CREATE_USER_PROCESS = async (password) => {

    const myImage = generateImage()
    const myPassword = await encryptPassword(password)

    return {
        myImage,
        myPassword
    }

    async function encryptPassword (password) {
        const encrypt = await bcrypt.hash(password,8)
        return encrypt
    }

    function generateImage () {
        const randomNumber = (Math.random() * 5 | 0)
        const image =
        [
            'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
            'https://react.semantic-ui.com/images/avatar/large/molly.png',
            'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
            'https://react.semantic-ui.com/images/avatar/large/daniel.jpg',
            'https://react.semantic-ui.com/images/avatar/large/matthew.png'
        ]
        const myImage = image[randomNumber]
        return myImage
    }

}


const LOGIN_USER_VALIDATION = (email,password) => {

    const errors = {}

    validateEmpty(email,password)

    return {
        errors
    }

    function validateEmpty(email,password) {
        if(email.trim() == '') {
            errors.email = 'Required'
        }
        if(password.trim() == '') {
            errors.password = 'Required'
        }
    }

}




module.exports = {
    CREATE_USER_VALIDATION,
    CREATE_USER_PROCESS,
    LOGIN_USER_VALIDATION
}
