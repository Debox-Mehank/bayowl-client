const fmt = require('indian-number-format')

export default function NumToPrice(num) {
    return `₹ ${fmt.format(num)}`
}