
const mongoose = require('mongoose')

const { AUTHENTICATE_HOME } = require('../../../utils/authenticate')
const { UserInputError } = require('apollo-server-express')

// model
const Room = require('../../../models/Room')
const RoomStatus = require('../../../models/RoomStatus')

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


module.exports = {
    Query: {
        async getRoom(_,{},context){

            const rooms = await getAllRoom()
            return rooms


        }
    },



    Mutation: {
        async joinRoom(_,{roomId},context) {


            user = "61813f0374c0f3266cbca6a5"
            room = "6182045e59918325e077f125"

            const rs = new RoomStatus({
                roomId: mongoose.Types.ObjectId(room),
                userId: mongoose.Types.ObjectId(user),
            })

            await rs.save()

            return "joined"

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
    }
}
