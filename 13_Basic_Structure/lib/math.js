// Math object - Module scaffolding
const math = {}

// Get random numbers
math.getRandomNumber = (min, max) => {
    let minimum = typeof min === 'number' ? min : 0
    let maximum = typeof max === 'number' ? max : 0

    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
}

module.exports = math