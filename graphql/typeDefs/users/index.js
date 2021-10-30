

const { gql } = require('apollo-server-express')

module.exports = gql`

    type User {

        email: String
        password: String
        confirmPassword: String
        displayName: String
        image: String
        loginToken: String
        verified: Boolean
        createdAt: String

    }

    type Query {

        _dummy: String

    }
    type Mutation {

        createUser(

            email: String
            password: String
            confirmPassword: String
            displayName: String
            image: String

        ): String
    }

`
