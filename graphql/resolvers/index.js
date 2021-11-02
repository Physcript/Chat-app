

const dummieResolvers = require('./dummies')
const userResolvers = require('./users')
const roomResolvers = require('./rooms')

module.exports = {
    Query: {
        ...dummieResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...dummieResolvers.Mutation,
        ...userResolvers.Mutation,
        ...roomResolvers.Mutation
    },
    Subscription: {
        ...dummieResolvers.Subscription,
    }
}
