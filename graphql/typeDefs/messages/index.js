

const { gql } = require('apollo-server-express')

module.exports = gql`
    type Mutation {
        sendMessage(body: String,roomId: String): String
    }
`
