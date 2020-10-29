"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
class BasicQuery {
    constructor() {
        this.driver = neo4j_driver_1.default.driver('bolt://localhost:11002', neo4j_driver_1.default.auth.basic('neo4j', '1234'));
        this.session = this.driver.session();
    }
    query(cypher) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield this.session.run(cypher);
            this.printResult(result);
            return result;
        });
    }
    // public async insert(data: any): Promise<void> {
    //     var result = await this.session.run(
    //         `
    //         CREATE (d:Dish {id: ${data.id}, name: ${data.title}, regional_cuisine: ${data.regional_cuisine}, taste: ${data.taste}, ingredients_details: ${data.ingredients_details}})
    //         MATCH (t: Taste {name: ${data.taste}}), (c: Cuisine {name: 中國菜}), (cc: Chinese_Cuisine {name: ${data.regional_cuisine}})
    //         CREATE (d)-[r1: has_taste]->(t)
    //         CREATE (d)-[r2: is_one_of]->(cc)
    //         RETURN d,t
    //     `,
    //         { data: data }
    //     )
    //     this.printResult(result)
    // }
    // public async update(data: any): Promise<void> {
    //     var result = await this.session.run(
    //         `
    //         MATCH (n:Dish)
    //         WHERE n.id = '${data.id}'
    //         SET n.description = '${data.description}'
    //         RETURN n
    //     `,
    //         { data: data }
    //     )
    //     this.printResult(result)
    // }
    printResult(result) {
        result.records.forEach(function (record) {
            console.log(record._fields[0].properties);
        });
    }
}
exports.default = BasicQuery;
//# sourceMappingURL=Basic.js.map