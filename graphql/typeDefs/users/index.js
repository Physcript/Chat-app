

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

    type Me {
        email: String
        displayName: String
        image: String
        verified: Boolean
        createdAt: String
    }

    type Auth_Me {
        user: Me
        valid: Boolean
    }

    type Token {
        loginToken: String
    }

    type Query {

        _dummy: String
        authenticateUser: Auth_Me

    }
    type Mutation {

        createUser (

            email: String
            password: String
            confirmPassword: String
            displayName: String
            image: String

        ): String

        loginUser (

            email: String
            password: String

        ): Token
    }

`
