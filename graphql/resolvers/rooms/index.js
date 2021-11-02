

const { AUTHENTICATE_HOME } = require('../../../utils/authenticate')
const { UserInputError } = require('apollo-server-express')

// model
const Room = require('../../../models/Room')

module.exports = {

    Mutation: {
        async createRoom(_,{name},context) {

            const errors = {}

            const { user,valid } = await AUTHENTICATE_HOME(context)

            if(!user){
                errors.title = 'UnAuthorized'
                throw new UserInputError('Error', {
                    errors
                })
            }
            await isValid(user,valid)

            if( Object.keys(errors).length >= 1){
                throw new UserInputError('Error', {
                    errors
                })
            }

            await createPublicRoom(name)

            if( Object.keys(errors).length >= 1){
                console.log(errors)
                throw new UserInputError('Error', {
                    errors
                })
            }

            return "Romm created"

            async function isValid(user,valid) {
                if(!valid) errors.title = 'UnAuthorized'
                if(user.role === 0) errors.title = 'UnAuthorized'
            }
            async function createPublicRoom(name) {
                const cleanName = name.trim()
                const checkName = await Room.findOne({name: cleanName})
                if(checkName){
                    errors.title = 'Duplicate name'
                    return
                }
                const room = new Room({
                    name: cleanName
                })

                await room.save()
            }
        }
    }
}
