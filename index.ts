import express from 'express'
import neo4j from 'neo4j-driver'
import Neode from 'neode';

const instance: Neode = Neode.fromEnv();

var graphenedbURL: string = 'bolt://localhost:7687'
var graphenedbUser: string = 'root'
var graphenedbPass: string = 'root'

var driver: any = neo4j.driver(
    graphenedbURL,
    neo4j.auth.basic(graphenedbUser, graphenedbPass)
)

var session = driver.session()
session
    .run(`MATCH (n:User) WHERE n.display_name='Rama' RETURN n`)
    .then(function(result: any) {
        result.records.forEach(function(record: any) {
            console.log(record._fields)
        })
        session.close()
    })
    .catch(function(error: object) {
        console.log(error)
    })
