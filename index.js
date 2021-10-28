// variables
require('dotenv').config()

// node
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

// apollo
const { ApolloServer } = require('apollo-server-express')
const { GraphQLUpload,graphqlUploadExpress } = require('graphql-upload')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

// sub
const { createServer } = require('http')
const { subscribe,execute } = require('graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { SubscriptionServer } = require('subscriptions-transport-ws')


async function START ( typeDefs,resolvers ) {

    // setup
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })
    const corsOptions = {
        origin: ["https://studio.apollographql.com","http://localhost:3000"] ,
        credentials: true
    }
    const PORT = process.env.PORT || 4000
    const app = express()

    // use
    app.use(cookieParser())
    app.use(cors(corsOptions))
    app.use(graphqlUploadExpress())

    // setup apollo
    const httpServer = createServer(app)
    const APOLLO_SERVER = new ApolloServer({
        schema,
        context: ({req,res}) => ({req,res}),
        plugins: [{
            async serverWillStart(){
                return {
                    async drainServer() {
                         SUBSCRIPTION_SERVER.close()
                    }
                }
            }
        }]
    })
    const SUBSCRIPTION_SERVER = new SubscriptionServer(
        { schema,subscribe,execute },
        { server: httpServer, path: APOLLO_SERVER.graphqlPath }
    )
    await APOLLO_SERVER.start()
    APOLLO_SERVER.applyMiddleware({
        app,
        cors: false
    })

    // setup connection
    mongoose.connect(process.env.MONGO_URI,{
        useUnifiedTopology: true
    }).then( () => {
        console.log(`DATABASE CONNECTED`)
    } ).then ( () => {
        httpServer.listen( PORT, () => console.log(`PORT: ${PORT}`) )
    })

}

START(typeDefs,resolvers)
