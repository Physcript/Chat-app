const { GraphQLUpload,graphqlUploadExpress } = require('graphql-upload')
const { PubSub,withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()


module.exports = {
    Upload: GraphQLUpload,
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
            return "dummy mutation"
        }
    },
    Subscription: {
        dummy: {
            subscribe: () => pubsub.asyncIterator(['DUMMY'])
        }
    }
}
