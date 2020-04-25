'use strict'
var __awaiter =
    (this && this.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function(resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected)
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            )
        })
    }
var __importStar =
    (this && this.__importStar) ||
    function(mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
        result['default'] = mod
        return result
    }
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
const WebRequest = __importStar(require('web-request'))
const cheerio = __importStar(require('cheerio'))
const Basic_1 = __importDefault(require('./src/Repository/Basic'))
const CSVServices_1 = __importDefault(require('./src/Services/CSVServices'))
// const csvWriter = CsvWriter.createObjectCsvWriter({
//     path: 'src/Data/BaikeDataset.csv',
//     header: [
//         { id: 'id', title: 'id' },
//         { id: 'name', title: 'name' },
//         { id: 'description', title: 'description' },
//         { id: 'ingredients', title: 'ingredients' },
//     ],
// })
function miningWithBaiduBaike(name) {
    return __awaiter(this, void 0, void 0, function*() {
        let encodeName = encodeURI(name)
        let url = `https://baike.baidu.com/item/${encodeName}`
        let result = yield WebRequest.get(url)
        let $ = cheerio.load(result.body)
        let description = $('.lemma-summary')
            .contents()
            .text()
            .replace(/\n/g, '')
        let rawInfo = $('.basicInfo-item')
            .contents()
            .text()
            .replace(/    /g, '')
        let ingredients = ''
        let strArr = rawInfo.split('\n')
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
        let responsesObject = {
            description: description,
            ingredients: ingredients,
        }
        return responsesObject
    })
}
// async function readCSV(): Promise<any[string]> {
//     var results: any[string] = []
//     let titleList: any[string] = []
//     await fs
//         .createReadStream('./src/Data/step10Data.csv')
//         .pipe(await csvReader())
//         .on('data', data => results.push(data))
//         .on('end', () => {
//             results.forEach(async function(result: any) {
//                 titleList.push(result.title)
//                 console.log(result)
//             })
//         })
//     return titleList
// }
// async function writeCSV(data: any): Promise<void> {
//     await csvWriter.writeRecords(data).then(() => {
//         console.log('Done!')
//     })
// }
function readCSVtoJSON() {
    return __awaiter(this, void 0, void 0, function*() {
        let csv = new CSVServices_1.default()
        let json = yield csv.readCSVtoJSON('./src/Data/step10Data.csv')
        return json
    })
}
function main() {
    return __awaiter(this, void 0, void 0, function*() {
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
        let json = yield readCSVtoJSON()
        for (let item of json) {
            console.log(item)
        }
        let cypher = `
                MATCH (n:Dish)
                WHERE n.id = '1'
                RETURN n`
        let neo4jQuery = new Basic_1.default()
        neo4jQuery.query(cypher)
        return 0
    })
}
main()
// readCSV()
// miningWithBaiduBaike('烹刀鱼')
// query()
//# sourceMappingURL=index.js.map
