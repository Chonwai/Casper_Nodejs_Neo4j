import neo4j from 'neo4j-driver'

class BasicQuery {
    private driver: any
    private session: any

    constructor() {
        this.driver = neo4j.driver(
            'bolt://localhost:7687',
            neo4j.auth.basic('neo4j', '1234')
        )
        this.session = this.driver.session()
    }

    public async query(cypher: string): Promise<object> {
        var result = await this.session.run(cypher)
        this.printResult(result)
        return result
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

    private printResult(result: any): void {
        result.records.forEach(function(record: any) {
            console.log(record._fields[0].properties)
        })
    }
}

export default BasicQuery
