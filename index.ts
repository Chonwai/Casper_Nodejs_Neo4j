import * as WebRequest from 'web-request'
import * as cheerio from 'cheerio'
import BasicQuery from './src/Repository/Basic'
import CSVServices from './src/Services/CSVServices'

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
        } else if (strArr[i] === '原材料') {
            ingredients = strArr[i + 1]
        }
    }

    let responsesObject: object = {
        description: description,
        ingredients: ingredients,
    }
    return responsesObject
}

async function readCSVtoJSON() {
    let csv: CSVServices = new CSVServices()
    let json: object = await csv.readCSVtoJSON('./src/Data/step10Data.csv')
    return json
}

async function main() {
    // let data: any
    // let miningData: any = {}
    // data = await readCSV()
    // await setTimeout(async () => {
    //     let insertData: any = []
    //     for (let i: number = 0; i < data.length; i++) {
    //         miningData = await miningWithBaiduBaike(data[i])
    //         miningData.id = i + 1
    //         miningData.name = data[i]
    //         console.log(miningData)
    //         insertData.push(miningData)
    //     }
    //     await writeCSV(insertData)
    // }, 500)

    let json: any = await readCSVtoJSON()

    // for (let item of json) {
    //     console.log(item)
    // }

    let cypher: string = `
                MATCH (n:Dish)
                WHERE n.id = '1'
                RETURN n`
    let neo4jQuery: BasicQuery = new BasicQuery()
    neo4jQuery.query(cypher)
}

main()
