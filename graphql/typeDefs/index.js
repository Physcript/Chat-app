const { gql } = require('apollo-server-express')
const dummiesDefs = require('./dummies')
const userDefs = require('./users')
const roomDefs = require('./rooms')
const messegeDefs = require('./messages')
module.exports = [ dummiesDefs,userDefs,roomDefs,messegeDefs ]
