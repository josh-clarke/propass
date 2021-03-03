#!/usr/bin/env node

// Imports
const { strict } = require('yargs')
const yargs = require('yargs')
const rand = require('random-seed').create()

// Data
const syllables = require('./syllables.json')

/**
 * Parse command line arguments
 */

yargs
    .scriptName('propass.js')
    .usage('$0 <cmd> [args]')
    .example([
        ['$0', 'Generates 3 password options with the defaults'],
        ['$0 -l 18', 'Generates 3 password options wthat are 18 characters long'],
        ['$0 -p 10 -s 2 -n 3 -c', 'Generates 10 password options with 2 symbols, 3 numbers, and capitals'],
        ['$0 -p 5 -mc', 'Generates 5 password options with capital letters and the numbers and symbols mixed in']
    ])
    .option('p', {
        alias: 'passwords',
        default: 3,
        describe: 'How many password options',
        type: 'number'
    })
    .option('l', {
        alias: 'lengthpass',
        default: 13,
        describe: 'Total characters in password',
        type: 'number'
    })
    .option('n', {
        alias: 'numbers',
        default: 2,
        describe: 'Number characters in password',
        type: 'number'
    })
    .option('s', {
        alias: 'symbols',
        default: 1,
        describe: 'Symbol characters in password',
        type: 'number'
    })
    .option ('c', {
        alias: 'caps',
        default: false,
        describe: 'Include capitals',
        type: 'boolean'
    })
    .option ('m', {
        alias: 'mix',
        default: false,
        describe: 'Mix the symbols and numbers randomly into the password',
        type: 'boolean'
    })
    .help()
    .argv

generatePassword(yargs.argv.lengthpass, yargs.argv.numbers, yargs.argv.symbols, yargs.argv.passwords, yargs.argv.caps, yargs.argv.mix)
    
    

/**
 * Generates password based on values specified
 */

function generatePassword(passwordLength = 13, numbersLength = 2, symbolsLength = 0,optionsLength = 3, caps = true, mix = false) {
    
    let passwordOptions = ''
    let trimValue = numbersLength + symbolsLength

    // Password Options
    for (o = 0; o < optionsLength; o++) {
        let password = []
        let word = passwordLength - trimValue
        let precedence = rand(2)
        
        // Word Creator
        for (x = 0; x < word; x++) {
            let rConsonants = rand(syllables.singleConsonants.length)
            let rVowels = rand(syllables.singleVowels.length)
            let rdConsonants = rand(syllables.doubleConsonants.length)
            let rdVowels = rand(syllables.doubleVowels.length)
            
            if (word < 10 | x < 2 | x > word - 3 ) {
                let consonant = capConsonant(syllables.singleConsonants[rConsonants], caps);
                let segment = '';

                if(precedence) {
                    segment += consonant
                    segment += syllables.singleVowels[rVowels]
                }else{                    
                    segment += syllables.singleVowels[rVowels]
                    segment += consonant
                }

                password.push(segment)
                x = x + 1
            } else if (x > 2 && x < word - 3) {
                if ((word - x) % 3 == 0) {
                    let consonant = capConsonant(syllables.doubleConsonants[rdConsonants], caps);
                    let segment = '';

                    if(precedence) {
                        segment += consonant
                        segment += syllables.singleVowels[rVowels]
                    }else{
                        segment += syllables.singleVowels[rVowels]
                        segment += consonant                        
                    }

                    password.push(segment)
                    x = x + 2
                } else if ((word - x) % 4 == 0) {
                    let consonant = capConsonant(syllables.doubleConsonants[rdConsonants], caps);
                    let segment = '';

                    if(precedence) {
                        segment += consonant
                        segment += syllables.doubleVowels[rdVowels]
                    }else{
                        segment += syllables.doubleVowels[rdVowels]
                        segment += consonant
                    }

                    password.push(segment)
                    x = x + 3
                } else if ((word - x) % 2 == 0) {
                    let segment = '';

                    segment += syllables.doubleVowels[rdVowels]

                    password.push(segment)
                    x = x + 1
                } else if ((word - x) % 1 == 0) {
                    // If it's prime!
                    let segment = '';

                    segment += syllables.singleVowels[rVowels]

                    password.push(segment)
                }
            }
        }

        // Symbol Creator        
        for(z = 0; z < symbolsLength; z++) {
            let randomSymbols = rand(syllables.symbols.length)

            password.push(syllables.symbols[randomSymbols])
        }

        // Number Creator
        for (y = 0; y < numbersLength; y++) {
            let randomNumbers = rand(syllables.numbers.length)

            password.push(syllables.numbers[randomNumbers])
        }

        if(mix) {
            shuffledPass = shuffleArray(password)
            passwordOptions += shuffledPass.join('') + '\n'
        }else{
            passwordOptions += password.join('') + '\n'
        }
    }

    console.log(passwordOptions)
}

function capConsonant(consonant, caps) {
    if(consonant.length < 2) {
        return consonant = caps ? consonant.toUpperCase() : consonant
    }else{
        return consonant = caps ? consonant.charAt(0).toUpperCase() + consonant.slice(1) : consonant
    }
}

function shuffleArray(arr) {
    let id = arr.length
    while (0 !== id) {
        let randomId = rand(id)
        id -= 1;

        let tmp = arr[id]
        arr[id] = arr[randomId]
        arr[randomId] = tmp;
    }
    return arr
    // https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
}