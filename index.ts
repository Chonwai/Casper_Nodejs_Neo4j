import neo4j from 'neo4j-driver'
import fs from 'fs'
import csvReader from 'csv-parser'
import * as CsvWriter from 'csv-writer'
import * as WebRequest from 'web-request'
import * as cheerio from 'cheerio'

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

const csvWriter = CsvWriter.createObjectCsvWriter({
    path: 'src/Data/out.csv',
    header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'description', title: 'description' },
        { id: 'ingredients', title: 'ingredients' },
    ],
})

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
}

async function update(data: any) {
    var result = await session.run(
        `
        MATCH (n:Dish)
        WHERE n.id = '${data.id}'
        SET n.description = '${data.description}'
        RETURN n
    `,
        { data: data }
    )
    result.records.forEach(function(record: any) {
        console.log(record._fields[0].properties)
    })
}

async function miningWithBaiduBaike(name: string) {
    let encodeName: string = encodeURI(name)
    let url: string = `https://baike.baidu.com/item/${encodeName}`
    let result: any = await WebRequest.get(url)
    let $ = cheerio.load(result.body)
    let description: string = $('.lemma-summary')
        .contents()
        .text()
        .replace(/\n/g, '')
    let rawInfo: any = $('.basicInfo-item')
        .contents()
        .text()
        .replace(/    /g, '')
    let ingredients: string = ''
    let strArr: any = rawInfo.split('\n')
    for (let i = 0; i < strArr.length; i++) {
        if (strArr[i] === '主要食材') {
            ingredients = strArr[i + 1]
        } else if (strArr[i] === '主要原料') {
            ingredients = strArr[i + 1]
        } else if (strArr[i] === '主料') {
            ingredients = strArr[i + 1]
        } else if (strArr[i] === '主料：') {
            ingredients = strArr[i + 1]
        } else if (strArr[i] === '原料') {
            ingredients = strArr[i + 1]
        }
    }

    let responsesObject: object = {
        description: description,
        ingredients: ingredients,
    }
    return responsesObject
}

async function readCSV(): Promise<any[string]> {
    var results: any[string] = []
    let titleList: any[string] = []
    await fs
        .createReadStream('./src/Data/RawData.csv')
        .pipe(await csvReader())
        .on('data', data => results.push(data))
        .on('end', () => {
            results.forEach(async function(result: any) {
                titleList.push(result.title)
            })
        })
    return titleList
}

async function writeCSV(data: any): Promise<void> {
    await csvWriter.writeRecords(data).then(() => {
        console.log('Done!')
    })
}

async function main() {
    let data: any
    let miningData: any = {}
    data = await readCSV()
    await setTimeout(async () => {
        let insertData: any = []
        for (let i: number = 0; i < data.length; i++) {
            miningData = await miningWithBaiduBaike(data[i])
            miningData.id = i + 1
            miningData.name = data[i]
            console.log(miningData)
            insertData.push(miningData)
        }
        await writeCSV(insertData)
    }, 500)
}

main()

// readCSV()

// miningWithBaiduBaike('烹刀鱼')

// query()
