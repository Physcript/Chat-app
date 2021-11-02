

const { gql } = require('apollo-server-express')

module.exports = gql`

    type Mutation {

        createRoom(name: String): String

    }

`
