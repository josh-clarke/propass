#!/usr/bin/env node

import { yargs } from 'yargs'
import { uheprng } from 'random-seed'

interface Syllable {
    singleConsonants: Array<{char: string, weight: number}>,
    doubleConsonants: Array<{char: string, weight: number}>,
    singleVowels: Array<{char: string, weight: number}>,
    doubleVowels: Array<{char: string, weight: number}>,
    numbers: string,
    symbols: string
}

const syllables: Syllable = require('./syllables.json')
const commands = yargs.scriptName('propass')
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

function generatePassword(passwordLength, numbersLength, symbolsLength, optionsLength, caps = false, mix = false): void {

    let passwordOptions: string 
    let trimValue: number = numbersLength + symbolsLength

    // Password Options
    for (let o:number = 0; o < optionsLength; o++) {
        let password: Array
        let word: number = passwordLength - trimValue
        let precedence: number = rand(2)
        
        // Word Creator
        for (let x: number = 0; x < word; x++) {
            
            if (x < 2 | x > word - 4 ) {
                password.push(doubleSegment(caps, precedence))
                x = x + 1
            } else if (x >= 2 && x <= word - 4) {
                if ((word - x) % 3 == 0) {
                    password.push(tripleSegment(caps, precedence))
                    x = x + 2
                } else if ((word - x) % 4 == 0) {
                    let segment: string
                    let doubleOrQuadruple: number = rand(2)
                    
                    if(doubleOrQuadruple == 0) {
                        segment = doubleSegment(caps, precedence)
                        segment += doubleSegment(caps, precedence)
                    }else{
                        segment = quadrupleSegment(caps, precedence)
                    }

                    password.push(segment)
                    x = x + 3
                } else if ((word - x) % 2 == 0) {
                    let segment: string
                    let doubleOrVowels: number = rand(2)

                    if(doubleOrVowels == 0) {
                        segment = doubleSegment(caps, precedence)
                    }else{
                        segment = setLetter(syllables.doubleVowels)
                    }

                    password.push(segment)
                    x = x + 1
                } else if ((word - x) % 1 == 0) {
                    // If it's prime!
                    let segment: string = setLetter(syllables.singleVowels)

                    password.push(segment)
                }
            }
        }

        // Symbol Creator        
        for(let z: number = 0; z < symbolsLength; z++) {
            let randomSymbols = rand(syllables.symbols.length)

            password.push(syllables.symbols[randomSymbols])
        }

        // Number Creator
        for (let y: number = 0; y < numbersLength; y++) {
            let randomNumbers: number = rand(syllables.numbers.length)

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

function doubleSegment(caps: boolean, precedence: number): string {
    let consonant: string = capConsonant(setLetter(syllables.singleConsonants), caps);
    let vowel: string = setLetter(syllables.singleVowels)
    let segment: string;

    if(precedence) {
        segment += consonant
        segment += vowel
    }else{                    
        segment += vowel
        segment += consonant
    }
    return segment
}

function tripleSegment(caps: boolean, precedence: number): string {
    let consonant: string = capConsonant(setLetter(syllables.doubleConsonants), caps);
    let vowel: string = setLetter(syllables.singleVowels)
    let segment: string

    if(precedence) {
        segment += consonant
        segment += vowel
    }else{
        segment += vowel
        segment += consonant                        
    }
    return segment
}

function tripleSegment(caps: boolean, precedence: number): string {
    let consonant: string = capConsonant(setLetter(syllables.doubleConsonants), caps);
    let vowel: string = setLetter(syllables.singleVowels)
    let segment: string;

    if(precedence) {
        segment += consonant
        segment += vowel
    }else{
        segment += vowel
        segment += consonant                        
    }
    return segment
}

function capConsonant(consonant: string, caps: boolean): string {
    if(consonant.length < 2) {
        return consonant = caps ? consonant.toUpperCase() : consonant
    }else{
        return consonant = caps ? consonant.charAt(0).toUpperCase() + consonant.slice(1) : consonant
    }
}

function setLetter(letterOptions: {char: string, weight: number}): string {
    let isChecking: boolean = true
    let letter: string

    while (isChecking) {
        let thisOption: number = rand(letterOptions.length)
        let letterSet: string = letterOptions[thisOption]

        if(weightCheck(letterSet.weight)) {
            letter = letterSet.char
            isChecking = false
        }
    }
    return letter
}

function weightCheck(weight: number): boolean {
    let d20: number = rand(20) + 1

    if (yargs.argv.unweighted || d20 >= weight) {
        return true
    }

    return false
}

function shuffleArray(arr: Array<string>): Array<string> {
    let id: number = arr.length
    while (0 !== id) {
        let randomId: string = rand(id)
        id -= 1

        let tmp: string = arr[id]
        arr[id] = arr[randomId]
        arr[randomId] = tmp
    }
    return arr
}
