

const dummieResolvers = require('./dummies')
const userResolvers = require('./users')

module.exports = {
    Query: {
        ...dummieResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...dummieResolvers.Mutation,
        ...userResolvers.Mutation,
    },
    Subscription: {
        ...dummieResolvers.Subscription,
    }
}
