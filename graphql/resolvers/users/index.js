
const { CREATE_USER_VALIDATION,CREATE_USER_PROCESS } = require('../../../utils/validation')

const { UserInputError } = require('apollo-server-express')
const User = require('../../../models/User')

module.exports = {
    Query: {
        async _dummy(){
            return "dummy"
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

        }
    }
}
