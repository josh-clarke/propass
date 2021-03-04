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
    .option ('w', {
        alias: 'unweighted',
        default: false,
        describe: 'Ignore the weighting for letter selection',
        type: 'boolean'
    })
    .requiresArg(['p', 'l', 'n', 's'])
    .strictOptions()
    .check((argv, options) => {
        if (argv.p < 1 || argv.p > 250) {
            throw new Error('Please specify a number of passwords between 1 and 250.\n\n“Form is emptiness; emptiness is form. Emptiness is none other than form; form is none other than emptiness.” —The Heart Sutra')
        } else if (argv.l < 10 || argv.l > 128) {
            throw new Error('Please specify a password length of 10 or greater and up to 128.')
        } else if (argv.n < 0) {
            throw new Error('Please specify zero or a positive amount of number characters.')
        }else if (argv.s < 0) {
            throw new Error('Please specify zero or a positive amount of symbol characters.')
        }else if (argv.n + argv.s > argv.l) {
            throw new Error('Please specify a total amount of numbers and symbols are equal to or less than the total length of the password.')
        }else if (isNaN(argv.p) || isNaN(argv.l) || isNaN(argv.n) || isNaN(argv.s) ) {
            throw new Error('Only numbers are accepted as input values.')
        }else{
            return true;
        }
    })
    .showHelpOnFail(false, 'Specify --help for available options')
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
            
            if (word < 10 | x < 2 | x > word - 3 ) {
                password.push(doubleSegment(caps, precedence))
                x = x + 1
            } else if (x > 2 && x < word - 3) {
                if ((word - x) % 3 == 0) {
                    password.push(tripleSegment(caps, precedence))
                    x = x + 2
                } else if ((word - x) % 4 == 0) {
                    let segment = ''
                    let doubleOrQuadruple = rand(2)
                    
                    if(doubleOrQuadruple == 0) {
                        segment = doubleSegment(caps, precedence)
                        segment += doubleSegment(caps, precedence)
                    }else{
                        segment = quadrupleSegment(caps, precedence)
                    }

                    password.push(segment)
                    x = x + 3
                } else if ((word - x) % 2 == 0) {
                    let segment = ''
                    let doubleOrVowels = rand(2)

                    if(doubleOrVowels == 0) {
                        segment = doubleSegment(caps, precedence)
                    }else{
                        segment = setLetter(syllables.doubleVowels)
                    }

                    password.push(segment)
                    x = x + 1
                } else if ((word - x) % 1 == 0) {
                    // If it's prime!
                    let segment = setLetter(syllables.singleVowels)

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

function doubleSegment(caps, precedence) {
    let consonant = capConsonant(setLetter(syllables.singleConsonants), caps);
    let vowel = setLetter(syllables.singleVowels)
    let segment = '';

    if(precedence) {
        segment += consonant
        segment += vowel
    }else{                    
        segment += vowel
        segment += consonant
    }
    return segment
}

function tripleSegment(caps, precedence) {
    let consonant = capConsonant(setLetter(syllables.doubleConsonants), caps);
    let vowel = setLetter(syllables.singleVowels)
    let segment = '';

    if(precedence) {
        segment += consonant
        segment += vowel
    }else{
        segment += vowel
        segment += consonant                        
    }
    return segment
}

function quadrupleSegment(caps, precedence) {
    let consonant = capConsonant(setLetter(syllables.doubleConsonants), caps);
    let vowel = setLetter(syllables.doubleVowels)
    let segment = '';

    if(precedence) {
        segment += consonant
        segment += vowel
    }else{
        segment += vowel
        segment += consonant
    }
    return segment
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

function setLetter(letterOptions) {
    let isChecking = true
    let letter = ''
    let blacklist = []

    while (isChecking) {
        let thisOption = rand(letterOptions.length)

        if(!blacklistCheck(thisOption)) {
            let letterSet = letterOptions[thisOption]

            if(weightCheck(letterSet[1])) {
                letter = letterSet[0]
                isChecking = false
            }else{
                blacklist.push(thisOption)
            }
        }

        if(blacklist.length == letterOptions.length) {
            blacklist = []
        }
    }
    return letter
}

function blacklistCheck(blacklist, thisOption) {
    let isBlacklisted = false

    if (blacklist.length > 0) {
        for(x = 0; x < blacklist.length; x++) {
            if (thisOption == blacklist[x]) {
                isBlacklisted == true
                break
            }
        }                
    }

    return isBlacklisted
}

function weightCheck(weight) {
    let d20 = rand(20) + 1

    if (!yargs.argv.unweighted || d20 >= weight) {
        return true;
    }

    return false;
}