
const { PubSub,withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()


module.exports = {

    Query: {
        async dummy(){
            return "dummy query"
        }
    },
    Mutation: {
        async dummy(_,{},context){
            pubsub.publish('DUMMY', {
                dummy: "SUBSCRIBE DUMMY"
            })

            console.log(context.req.headers)
            console.log(context.req.cookies)

            return "dummy mutation"
        }
    },
    Subscription: {
        dummy: {
            subscribe: () => pubsub.asyncIterator(['DUMMY'])
        }
    }

}
