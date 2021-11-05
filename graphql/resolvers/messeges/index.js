
require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { PubSub,withFilter } = require('graphql-subscriptions')

const { AUTHENTICATE_HOME,AUTHENTICATE_ROOM } = require('../../../utils/authenticate')
const { VALID_MESSAGE_VALIDATION } = require('../../../utils/validation')
const { AuthenticationError } = require('apollo-server-express')

const Message = require('../../../models/Message')

const pubsub = new PubSub()

module.exports = {
    Query: {
        async messageRoom(_,{roomId},context) {

            const {user,valid:userValid} = await AUTHENTICATE_HOME(context)

            if(!userValid) {
                throw new AuthenticationError()
            }

            const message = await getMessage(roomId)
            return message
        }
    },
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


            pubsub.publish('NEW_MESSAGE',{
                refreshMessage: "asddd"
            })

            return "Messaged"

        }
    },


    Subscription: {
        refreshMessage: {
            subscribe: withFilter (
                (_,{},context) => pubsub.asyncIterator(['NEW_MESSAGE']),
                async (payload,variables,context,authToken) => {

                    const users = await getUserId(variables.roomId)
                    const user = await getId(variables.token)
                    let valid = false

                    for( const data of users ) {

                        const check = data.toString()
                        if(check == user){
                            valid = true
                        }


                    }


                    return valid
                }
            )
        }
    }
}


async function getUserId(roomId){

    const users = await Message.distinct('userId')
    return users
}

async function getId(token){

    const decode = jwt.verify(token,process.env.JWT_SECRET)

    const user = decode._id

    return user

}














async function getMessage(roomId,index = 10) {
    const message = await Message.aggregate([

        {
            $match: {
                 roomId: mongoose.Types.ObjectId(roomId)
            }

        },
        {
            $project:{

                body: "$body",
                createdAt: "$createdAt",
                roomId: "$roomId",
                userId: "$userId",

            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $project:{

                body: 1,
                createdAt: 1,
                roomId: 1,
                userId: 1,
                user: '$users'
            }
        },
        {
            $unwind: '$user'
        }
    ]).sort({createdAt: -1}).limit(index)

    return message

}
