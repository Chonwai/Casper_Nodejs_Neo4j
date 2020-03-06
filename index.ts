import express from 'express'
import neo4j from 'neo4j-driver'
// import neo4j from 'neo4j'
import Neode from 'neode'
import dotenv from 'dotenv'

// const instance: Neode = Neode.fromEnv()

// dotenv.config()

var graphenedbURL: any = process.env['NEO4J_URL']
var graphenedbUser: any = process.env['NEO4J_USERNAME']
var graphenedbPass: any = process.env['NEO4J_PASSWORD']
var graphenedbHost: any = process.env['NEO4J_HOST']
var graphenedbHTTPPort: any = process.env['NEO4J_HTTP_PORT']

var driver: any = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
)

var session = driver.session()
// session
//     .run(`CREATE (n:Person {name: $nameParam}) RETURN n`, {
//         nameParam: 'Alice',
//     })
//     .then(function(result: any) {
//         result.records.forEach(function(record: any) {
//             console.log(record._fields)
//         })
//         session.close()
//     })
//     .catch(function(error: object) {
//         console.log(error)
//     })

async function query() {
    // var result = await session.run(
    //     `CREATE (n:Person {name: $nameParam}) RETURN n`,
    //     { nameParam: 'Tom' }
    // )
    var result = await session.run(`MATCH (n:Person) RETURN n`)
    console.log(result.records)
}

query()
