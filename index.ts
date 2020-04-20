import neo4j from 'neo4j-driver'
import Neode from 'neode'
import dotenv from 'dotenv'
import fs from 'fs'
import csv from 'csv-parser'
import fetch from 'node-fetch'
import * as WebRequest from 'web-request'
import * as cheerio from 'cheerio'
import toUnicode from './src/Utils/utils'

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

async function query() {
    var result = await session.run(`
        MATCH (d)
        WHERE (d)-[:has_taste]->(:Taste {name:'酸辣'}) AND (d)-[:is_one_of]->(:Chinese_Cuisine {name: '湘菜'})
        RETURN d
    `)
    result.records.forEach(function(record: any) {
        console.log(record._fields[0].properties)
    })
}

async function insert(data: any) {
    console.log(data.taste)
    var result = await session.run(
        `
        CREATE (d:Dish {id: ${data.id}, name: ${data.title}, regional_cuisine: ${data.regional_cuisine}, taste: ${data.taste}, ingredients_details: ${data.ingredients_details}})
        MATCH (t: Taste {name: ${data.taste}}), (c: Cuisine {name: 中國菜}), (cc: Chinese_Cuisine {name: ${data.regional_cuisine}})
        CREATE (d)-[r1: has_taste]->(t)
        CREATE (d)-[r2: is_one_of]->(cc)
        RETURN d,t
    `,
        { data: data }
    )
    // console.log(result)
}

async function miningWithBaiduBaike(name: string) {
    let encodeName: string = encodeURI(name)
    let url: string = `https://baike.baidu.com/item/${encodeName}`
    let result: any = await WebRequest.get(url)
    let $ = cheerio.load(result.body)
    let rawInfo: any = $('.basicInfo-item')
        .contents()
        .text()
    let ingredients: string = ''
    let strArr: [] = rawInfo.split('\n')
    for (let i = 0; i < strArr.length; i++) {
        if (strArr[i] === '主要食材') {
            ingredients = strArr[i + 1]
        }
    }
    console.log(name + ': ' + ingredients)
}

async function readCSV(): Promise<any[string]> {
    var results: any[string] = []
    let titleList: any[string] = []
    await fs
        .createReadStream('./src/Data/RawData.csv')
        .pipe(await csv())
        .on('data', data => results.push(data))
        .on('end', () => {
            results.forEach(async function(result: any) {
                titleList.push(result.title)
            })
        })
    return titleList
}

async function main() {
    let data: any
    let array: any
    data = await readCSV()
    setTimeout(async () => {
        for (let i of data) {
            await miningWithBaiduBaike(i)
        }
    }, 500)
}

main()

// readCSV()

// miningWithBaiduBaike('烹刀鱼')

// query()
