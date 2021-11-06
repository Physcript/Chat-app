
const mongoose = require('mongoose')

const { AUTHENTICATE_HOME } = require('../../../utils/authenticate')
const { JOIN_USER_ROOM_VALIDATION } = require('../../../utils/validation')
const { UserInputError,AuthenticationError } = require('apollo-server-express')

// model
const Room = require('../../../models/Room')
const RoomStatus = require('../../../models/RoomStatus')

// sub
const { PubSub,withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()


async function getAllRoom () {
    const rooms = await Room.aggregate([
        {
            $project: {
                "_id": "$_id",
                "name": "$name"
            }
        },
        {
            $lookup: {
                from: 'roomstatuses',
                localField: '_id',
                foreignField: 'roomId',
                as: "roomCount"
            }
        },
        {
            $project: {
                "_id": 1,
                "name": 1,
                "count": { $size: {$ifNull : ["$roomCount", []] } }
            }
        }


    ])
    return rooms
}

async function getRoom (id) {

    const rooms = await Room.aggregate([
        {
            $match: {
                "_id": mongoose.Types.ObjectId(id)
            }
        },
        {
            $project: {
                "_id": "$_id",
                "name": "$name"
            }
        },
        {
            $lookup: {
                from: 'roomstatuses',
                localField: '_id',
                foreignField: 'roomId',
                as: "roomCount"
            }
        },
        {
            $project: {
                "_id": 1,
                "name": 1,
                "count": { $size: {$ifNull : ["$roomCount", []] } }
            }
        }


    ])
    return rooms
}




module.exports = {
    Query: {
        async getRoom(_,{},context){
            const rooms = await getAllRoom()

            return rooms

        }
    },



    Mutation: {

        async joinRoom(_,{roomId},context) {
            // validate user
            let { user,valid } = await AUTHENTICATE_HOME(context)
            if( !valid ) throw new AuthenticationError()
            await JOIN_USER_ROOM_VALIDATION(user)

            const rs = new RoomStatus({
                roomId: mongoose.Types.ObjectId(roomId),
                userId: mongoose.Types.ObjectId(user._id),
            })

            await rs.save()

            const room = await getRoom(roomId)

            const roomInfo = {
                _id: room[0]._id,
                name: room[0].name,
                count: room[0].count
            }

            pubsub.publish('JOIN_ROOM',{
                refreshRoom: "asd"
            })

            return roomInfo

        },
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
    },
    Subscription: {
        refreshRoom: {
            subscribe: withFilter (
                () => pubsub.asyncIterator(['JOIN_ROOM']),
                () =>  {

                    return true
                }

            )
        }
    }
}
