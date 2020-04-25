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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import CSVReader from 'csv-parser'
const CSVWriter = __importStar(require("csv-writer"));
const csvtojson_1 = __importDefault(require("csvtojson"));
class CSVServices {
    constructor() {
        this.csvWriter = CSVWriter.createObjectCsvWriter({
            path: 'src/Data/BaikeDataset.csv',
            header: [
                { id: 'id', title: 'id' },
                { id: 'name', title: 'name' },
                { id: 'description', title: 'description' },
                { id: 'ingredients', title: 'ingredients' },
            ],
        });
    }
    readCSVtoJSON(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield csvtojson_1.default().fromFile(path);
            return file;
        });
    }
    writeCSV(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.csvWriter.writeRecords(data).then(() => {
                console.log('Done!');
            });
        });
    }
}
exports.default = CSVServices;
//# sourceMappingURL=CSVServices.js.map