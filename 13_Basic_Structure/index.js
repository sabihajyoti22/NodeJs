/*
 * Title: Basic Node app example
 * Description: Simple node application that print random quotes per second interval.
 * Author: Sabiha Nasrin Jyoti
 * Date: 20/10/24
 * Learnt from: Learn with sumit
 */

// Dependencies
const math = require('./lib/math')
const quotes = require('./lib/quotes')

// App object - Module scaffolding
const app = {}

// Configuration
app.config = {
    timeBetweenQuotes: 1000
}

// Function that prints a random quote
app.printQuotes = () => {
    const allQuotes = quotes.allQuotes()

    let index = math.getRandomNumber(0, allQuotes.length - 1)

    console.log(allQuotes[index])
}

app.indefiniteLoop = () => {
    setInterval(app.printQuotes, app.config.timeBetweenQuotes)
}

app.indefiniteLoop()