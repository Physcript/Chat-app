
const bcrypt = require('bcrypt')

const { CREATE_USER_VALIDATION,CREATE_USER_PROCESS,LOGIN_USER_VALIDATION } = require('../../../utils/validation')
const { GENERATE_LOGIN_TOKEN } = require('../../../utils/generate')
const { AUTHENTICATE_HOME } = require('../../../utils/authenticate')

const { UserInputError } = require('apollo-server-express')
const User = require('../../../models/User')

module.exports = {
    Query: {

        async _dummy(){
            return "dummy"
        },

        async authenticateUser(_,{},context) {

            const { user,valid } =  await AUTHENTICATE_HOME(context)
            return {

                user,
                valid

            }
        }

    },
    Mutation: {

        async createUser(
            _,
            {email,password,confirmPassword,displayName}
            ){

                const { errors, valid } = await CREATE_USER_VALIDATION(email,password,confirmPassword,displayName)

                if(!valid){
                    throw new UserInputError('Errors', {
                        errors
                    })
                }

                const { myImage,myPassword } = await CREATE_USER_PROCESS(password)
                createAccount(email,myPassword,myImage,displayName)
                return "Account created"

                async function createAccount(email,myPassword,myImage,displayName) {
                    const user = new User({
                        email,
                        password: myPassword,
                        image: myImage,
                        displayName,
                        verified: false,
                        createdAt: new Date().toISOString()
                    })
                    await user.save()
                    return
                }
        },
        async loginUser(_,{email,password},context) {

            const { errors } = await LOGIN_USER_VALIDATION(email,password)

            if(Object.keys(errors).length >= 1) {
                throw new UserInputError('Errors', {
                    errors
                })
            }
            const token = await validatePassword(email,password)

            if(Object.keys(errors).length >= 1) {
                throw new UserInputError('Errors', {
                    errors
                })
            }


            return {
                loginToken: token
            }


            async function validatePassword (email,password) {

                const user = await User.findOne({email}) || ''

                if(!user) {
                    errors.email = 'Email/Password not match'
                    errors.password = 'Email/Password not match'
                    return
                }

                const validate = await bcrypt.compare(password,user.password)

                if(!validate) {
                    errors.email = 'Email/Password not match'
                    errors.password = 'Email/Password not match'
                    return
                }

                const token = await GENERATE_LOGIN_TOKEN(user)

                user.loginToken = token
                user.online = true
                await user.save()

                return token

            }

        }
    }
}
