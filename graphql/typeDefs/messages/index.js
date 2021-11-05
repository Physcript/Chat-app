

const { gql } = require('apollo-server-express')

module.exports = gql`

    type M_User {
        _id: String
        email: String
        displayName: String
        online: String
        image: String
        verified: String
    }

    type M_Message {
        _id: String
        body: String
        createdAt:String
        roomId: String,
        userId: String,
        user: M_User

        }

        type Query {
            messageRoom(roomId: String): [M_Message]
        }
        type Mutation {
            sendMessage(body: String,roomId: String): String
        }

        type Subscription {
            refreshMessage(roomId: String, token: String): String
        }
    `
