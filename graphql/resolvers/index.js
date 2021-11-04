

const dummieResolvers = require('./dummies')
const userResolvers = require('./users')
const roomResolvers = require('./rooms')
const messegeResolvers = require('./messeges')

module.exports = {
    Query: {
        ...dummieResolvers.Query,
        ...userResolvers.Query,
        ...roomResolvers.Query,
    },
    Mutation: {
        ...dummieResolvers.Mutation,
        ...userResolvers.Mutation,
        ...roomResolvers.Mutation,
        ...messegeResolvers.Mutation,
    },
    Subscription: {
        ...dummieResolvers.Subscription,
    }
}
