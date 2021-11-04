

const { AUTHENTICATE_HOME,AUTHENTICATE_ROOM } = require('../../../utils/authenticate')
const { VALID_MESSAGE_VALIDATION } = require('../../../utils/validation')
const { AuthenticationError } = require('apollo-server-express')

const Message = require('../../../models/Message')


module.exports = {
    Mutation: {
        async sendMessage(_,{body,roomId},context){

            const {user,valid:userValid} = await AUTHENTICATE_HOME(context)
            const {room,valid:roomValid} = await AUTHENTICATE_ROOM(roomId)
            const {valid: bodyValid} = await VALID_MESSAGE_VALIDATION(body)

            await SM(body,roomId,user._id)

            if(!roomValid || !userValid || !bodyValid){
                throw new AuthenticationError()
            }

            async function SM(body,roomId,userId) {

                const message = new Message({
                    roomId,
                    userId,
                    body,
                    createdAt: new Date().toISOString()
                })
                await message.save()

            }

            return "Messaged"

        }
    }
}
