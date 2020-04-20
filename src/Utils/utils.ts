function toUnicode(str: string) {
    return str
        .split('')
        .map(function(value, index, array) {
            var temp = value
                .charCodeAt(0)
                .toString(16)
                .toUpperCase()
            if (temp.length > 2) {
                return '%' + temp
            }
            return value
        })
        .join('')
}

export default toUnicode
