import fs from 'fs'
// import CSVReader from 'csv-parser'
import * as CSVWriter from 'csv-writer'
import CSVtoJSON from 'csvtojson'

class CSVServices {
    private csvWriter: any
    constructor() {
        this.csvWriter = CSVWriter.createObjectCsvWriter({
            path: 'src/Data/BaikeDataset.csv',
            header: [
                { id: 'id', title: 'id' },
                { id: 'name', title: 'name' },
                { id: 'description', title: 'description' },
                { id: 'ingredients', title: 'ingredients' },
            ],
        })
    }
    public async readCSVtoJSON(path: string): Promise<any[string]> {
        let file: any = await CSVtoJSON().fromFile(path)
        return file
    }

    public async writeCSV(data: any): Promise<void> {
        await this.csvWriter.writeRecords(data).then(() => {
            console.log('Done!')
        })
    }
}

export default CSVServices
