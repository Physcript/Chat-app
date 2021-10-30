const { gql } = require('apollo-server-express')
const dummiesDefs = require('./dummies')
const userDefs = require('./users')

module.exports = [ dummiesDefs,userDefs ]
