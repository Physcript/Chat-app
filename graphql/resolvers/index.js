

const dummieResolvers = require('./dummies')
const userResolvers = require('./users')
const roomResolvers = require('./rooms')
const messegeResolvers = require('./messeges')

module.exports = {
    Query: {
        ...dummieResolvers.Query,
        ...userResolvers.Query,
        ...roomResolvers.Query,
        ...messegeResolvers.Query,
    },
    Mutation: {
        ...dummieResolvers.Mutation,
        ...userResolvers.Mutation,
        ...roomResolvers.Mutation,
        ...messegeResolvers.Mutation,
    },
    Subscription: {
        ...dummieResolvers.Subscription,
        ...messegeResolvers.Subscription,
        ...roomResolvers.Subscription,
        ...userResolvers.Subscription,
    }
}
