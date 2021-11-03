

const { gql } = require('apollo-server-express')

module.exports = gql`

    type RoomInfo {
        _id: ID
        name: String
        count: Int
    }

    type Query {
        getRoom: [RoomInfo]
    }

    type Mutation {

        createRoom(name: String): String
        joinRoom(roomId: String): String

    }

`
