'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
var neo4j_driver_1 = __importDefault(require('neo4j-driver'))
var graphenedbURL = 'bolt://localhost:7687'
var graphenedbUser = 'root'
var graphenedbPass = 'root'
var driver = neo4j_driver_1.default.driver(
    graphenedbURL,
    neo4j_driver_1.default.auth.basic(graphenedbUser, graphenedbPass)
)
var session = driver.session()
session
    .run("MATCH (n:User) WHERE n.display_name='Rama' RETURN n")
    .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record._fields)
        })
        session.close()
    })
    .catch(function(error) {
        console.log(error)
    })
