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
var __generator =
    (this && this.__generator) ||
    function(thisArg, body) {
        var _ = {
                label: 0,
                sent: function() {
                    if (t[0] & 1) throw t[1]
                    return t[1]
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function() {
                    return this
                }),
            g
        )
        function verb(n) {
            return function(v) {
                return step([n, v])
            }
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                    ? y['throw'] ||
                                      ((t = y['return']) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t
                    if (((y = 0), t)) op = [op[0] & 2, t.value]
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op
                            break
                        case 4:
                            _.label++
                            return { value: op[1], done: false }
                        case 5:
                            _.label++
                            y = op[1]
                            op = [0]
                            continue
                        case 7:
                            op = _.ops.pop()
                            _.trys.pop()
                            continue
                        default:
                            if (
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0
                                continue
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
                                _.label = op[1]
                                break
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1]
                                t = op
                                break
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2]
                                _.ops.push(op)
                                break
                            }
                            if (t[2]) _.ops.pop()
                            _.trys.pop()
                            continue
                    }
                    op = body.call(thisArg, _)
                } catch (e) {
                    op = [6, e]
                    y = 0
                } finally {
                    f = t = 0
                }
            if (op[0] & 5) throw op[1]
            return { value: op[0] ? op[1] : void 0, done: true }
        }
    }
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
var neo4j_driver_1 = __importDefault(require('neo4j-driver'))
var fs_1 = __importDefault(require('fs'))
var csv_parser_1 = __importDefault(require('csv-parser'))
// const instance: Neode = Neode.fromEnv()
// dotenv.config()
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
    return __awaiter(this, void 0, void 0, function() {
        var result
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    return [
                        4 /*yield*/,
                        session.run(
                            "\n        MATCH (d)\n        WHERE (d)-[:has_taste]->(:Taste {name:'\u9178\u8FA3'}) AND (d)-[:is_one_of]->(:Chinese_Cuisine {name: '\u6E58\u83DC'})\n        RETURN d\n    "
                        ),
                    ]
                case 1:
                    result = _a.sent()
                    result.records.forEach(function(record) {
                        console.log(record._fields[0].properties)
                    })
                    return [2 /*return*/]
            }
        })
    })
}
function insert(data) {
    return __awaiter(this, void 0, void 0, function() {
        var result
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    console.log(data.taste)
                    return [
                        4 /*yield*/,
                        session.run(
                            '\n        CREATE (d:Dish {id: ' +
                                data.id +
                                ', name: ' +
                                data.title +
                                ', regional_cuisine: ' +
                                data.regional_cuisine +
                                ', taste: ' +
                                data.taste +
                                ', ingredients_details: ' +
                                data.ingredients_details +
                                '})\n        MATCH (t: Taste {name: ' +
                                data.taste +
                                '}), (c: Cuisine {name: \u4E2D\u570B\u83DC}), (cc: Chinese_Cuisine {name: ' +
                                data.regional_cuisine +
                                '})\n        CREATE (d)-[r1: has_taste]->(t)\n        CREATE (d)-[r2: is_one_of]->(cc)\n        RETURN d,t\n    ',
                            { data: data }
                        ),
                        // console.log(result)
                    ]
                case 1:
                    result = _a.sent()
                    return [2 /*return*/]
            }
        })
    })
}
function readCSV() {
    return __awaiter(this, void 0, void 0, function() {
        var results
        var _this = this
        return __generator(this, function(_a) {
            results = []
            fs_1.default
                .createReadStream('./src/Data/RawData.csv')
                .pipe(csv_parser_1.default())
                .on('data', function(data) {
                    return __awaiter(_this, void 0, void 0, function() {
                        return __generator(this, function(_a) {
                            switch (_a.label) {
                                case 0:
                                    return [4 /*yield*/, results.push(data)]
                                case 1:
                                    return [2 /*return*/, _a.sent()]
                            }
                        })
                    })
                })
                .on('end', function() {
                    return __awaiter(_this, void 0, void 0, function() {
                        return __generator(this, function(_a) {
                            switch (_a.label) {
                                case 0:
                                    return [
                                        4 /*yield*/,
                                        results.forEach(function(result) {
                                            return __awaiter(
                                                this,
                                                void 0,
                                                void 0,
                                                function() {
                                                    return __generator(
                                                        this,
                                                        function(_a) {
                                                            console.log(
                                                                result.title
                                                            )
                                                            return [
                                                                2 /*return*/,
                                                            ]
                                                        }
                                                    )
                                                }
                                            )
                                        }),
                                    ]
                                case 1:
                                    _a.sent()
                                    return [2 /*return*/]
                            }
                        })
                    })
                })
            return [2 /*return*/, results]
        })
    })
}
function main() {
    return __awaiter(this, void 0, void 0, function() {
        var data
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    data = []
                    return [4 /*yield*/, readCSV()]
                case 1:
                    data = _a.sent()
                    console.log(data)
                    return [2 /*return*/]
            }
        })
    })
}
// main()
readCSV()
// query()
