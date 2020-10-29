"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toUnicode(str) {
    return str
        .split('')
        .map(function (value, index, array) {
        var temp = value
            .charCodeAt(0)
            .toString(16)
            .toUpperCase();
        if (temp.length > 2) {
            return '%' + temp;
        }
        return value;
    })
        .join('');
}
exports.default = toUnicode;
//# sourceMappingURL=utils.js.map