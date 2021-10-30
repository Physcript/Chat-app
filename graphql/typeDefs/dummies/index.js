


const { gql } = require('apollo-server-express')


module.exports = gql`
    scalar Upload

    type Query {
        dummy: String
    }
    type Mutation {
        dummy: String
    }
    type Subscription {
        dummy: String
    }
`
