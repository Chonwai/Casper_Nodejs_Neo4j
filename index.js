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
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod }
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
Object.defineProperty(exports, '__esModule', { value: true })
const neo4j_driver_1 = __importDefault(require('neo4j-driver'))
const fs_1 = __importDefault(require('fs'))
const csv_parser_1 = __importDefault(require('csv-parser'))
const WebRequest = __importStar(require('web-request'))
const cheerio = __importStar(require('cheerio'))
var graphenedbURL = process.env['NEO4J_URL']
var graphenedbUser = process.env['NEO4J_USERNAME']
var graphenedbPass = process.env['NEO4J_PASSWORD']
var graphenedbHost = process.env['NEO4J_HOST']
var graphenedbHTTPPort = process.env['NEO4J_HTTP_PORT']
var driver = neo4j_driver_1.default.driver(
    'bolt://localhost:7687',
    neo4j_driver_1.default.auth.basic('neo4j', '1234')
)
var session = driver.session()
function query() {
    return __awaiter(this, void 0, void 0, function*() {
        var result = yield session.run(`
        MATCH (d)
        WHERE (d)-[:has_taste]->(:Taste {name:'酸辣'}) AND (d)-[:is_one_of]->(:Chinese_Cuisine {name: '湘菜'})
        RETURN d
    `)
        result.records.forEach(function(record) {
            console.log(record._fields[0].properties)
        })
    })
}
function insert(data) {
    return __awaiter(this, void 0, void 0, function*() {
        console.log(data.taste)
        var result = yield session.run(
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
    })
}
function miningWithBaiduBaike(name) {
    return __awaiter(this, void 0, void 0, function*() {
        let encodeName = encodeURI(name)
        let url = `https://baike.baidu.com/item/${encodeName}`
        let result = yield WebRequest.get(url)
        let $ = cheerio.load(result.body)
        let rawInfo = $('.basicInfo-item')
            .contents()
            .text()
        let ingredients = ''
        let strArr = rawInfo.split('\n')
        for (let i = 0; i < strArr.length; i++) {
            if (strArr[i] === '主要食材') {
                ingredients = strArr[i + 1]
            }
        }
        console.log(name + ': ' + ingredients)
    })
}
function readCSV() {
    return __awaiter(this, void 0, void 0, function*() {
        var results = []
        let titleList = []
        yield fs_1.default
            .createReadStream('./src/Data/RawData.csv')
            .pipe(yield csv_parser_1.default())
            .on('data', data => results.push(data))
            .on('end', () => {
                results.forEach(function(result) {
                    return __awaiter(this, void 0, void 0, function*() {
                        titleList.push(result.title)
                    })
                })
            })
        return titleList
    })
}
function main() {
    return __awaiter(this, void 0, void 0, function*() {
        let data
        let array
        data = yield readCSV()
        setTimeout(
            () =>
                __awaiter(this, void 0, void 0, function*() {
                    for (let i of data) {
                        yield miningWithBaiduBaike(i)
                    }
                }),
            500
        )
    })
}
main()
// readCSV()
// miningWithBaiduBaike('烹刀鱼')
// query()
//# sourceMappingURL=index.js.map
