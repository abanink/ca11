/**
* Generic util methods for the App namespace.
* @memberof App
*/
class Utils {

    constructor() {
        String.prototype.ca = function() {
            return this.charAt(0).toUpperCase() + this.slice(1)
        }
        String.prototype.uc = function() {
            return this.charAt(0).toUpperCase() + this.slice(1)
        }
    }

    copyObject(obj) {
        return JSON.parse(JSON.stringify(obj))
    }


    /**
    * Clear a phonenumber from special characters like `+`, `*` and `*`.
    * @param {String} number - Number to clean.
    * @returns {String} - The cleaned number.
    */
    sanitizeNumber(number) {
        number = String(number).replace('+', '00')
        number = number.replace(/[^\d|!*|!#]/g, '')
        return number
    }


    /**
    * Generic sort function on multiple keys.
    * @param {Array} keys - Order of keys to search in.
    * @param {Number} order - The order to sort.
    * @returns {Function} - The sorting function.
    */
    sortByMultipleKey(keys, order = 1) {
        return (a, b) => {
            if (keys.length === 0) return 0
            var key = keys[0]
            if (a[key] < b[key]) return -order
            else if (a[key] > b[key]) return order
            else return this.sortByMultipleKey(keys.slice(1))(a, b)
        }
    }


    /**
    * Convert a simple key/value object to a querystring.
    * @param {Object} params - Key/value object to convert.
    * @returns {String} - The querystring.
    * @example
    * stringifySearch({page: "1"})
    * // page=1
    */
    stringifySearch(params) {
        return Object
            .keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&')
    }
}


module.exports = Utils
