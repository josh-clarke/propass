#!/usr/bin/env node
"use strict";
exports.__esModule = true;
// Imports
var yargs = require("yargs");
var uheprng = require("random-seed");
// Variables
var syllables = require('./syllables.json');
var rand = uheprng.create();
/**
 * Parse command line arguments
 */
yargs
    .scriptName('propass')
    .usage('$0 <cmd> [args]')
    .example([
    ['$0', 'Generates 3 password options with the defaults'],
    ['$0 -l 18', 'Generates 3 password options wthat are 18 characters long'],
    ['$0 -p 10 -s 2 -n 3 -c', 'Generates 10 password options with 2 symbols, 3 numbers, and capitals'],
    ['$0 -p 5 -mc', 'Generates 5 password options with capital letters and the numbers and symbols mixed in']
])
    .option('p', {
    alias: 'passwords',
    "default": 3,
    describe: 'How many password options',
    type: 'number'
})
    .option('l', {
    alias: 'lengthpass',
    "default": 13,
    describe: 'Total characters in password',
    type: 'number'
})
    .option('n', {
    alias: 'numbers',
    "default": 2,
    describe: 'Number characters in password',
    type: 'number'
})
    .option('s', {
    alias: 'symbols',
    "default": 1,
    describe: 'Symbol characters in password',
    type: 'number'
})
    .option('c', {
    alias: 'caps',
    "default": false,
    describe: 'Include capitals',
    type: 'boolean'
})
    .option('m', {
    alias: 'mix',
    "default": false,
    describe: 'Mix the symbols and numbers randomly into the password',
    type: 'boolean'
})
    .option('w', {
    alias: 'unweighted',
    "default": false,
    describe: 'Ignore the weighting for letter selection',
    type: 'boolean'
})
    .requiresArg(['p', 'l', 'n', 's'])
    .strictOptions()
    .check(function (argv, options) {
    if (argv.p < 1 || argv.p > 250) {
        throw new Error('Please specify a number of passwords between 1 and 250.\n\n“Form is emptiness; emptiness is form. Emptiness is none other than form; form is none other than emptiness.” —The Heart Sutra');
    }
    else if (argv.l < 10 || argv.l > 128) {
        throw new Error('Please specify a password length of 10 or greater and up to 128.');
    }
    else if (argv.n < 0) {
        throw new Error('Please specify zero or a positive amount of number characters.');
    }
    else if (argv.s < 0) {
        throw new Error('Please specify zero or a positive amount of symbol characters.');
    }
    else if (argv.n + argv.s > argv.l) {
        throw new Error('Please specify a total amount of numbers and symbols are equal to or less than the total length of the password.');
    }
    else if (isNaN(argv.p) || isNaN(argv.l) || isNaN(argv.n) || isNaN(argv.s)) {
        throw new Error('Only numbers are accepted as input values.');
    }
    else {
        return true;
    }
})
    .showHelpOnFail(false, 'Specify --help for available options')
    .help()
    .argv;
generatePassword(yargs.argv.lengthpass, yargs.argv.numbers, yargs.argv.symbols, yargs.argv.passwords, yargs.argv.caps, yargs.argv.mix);
/**
 * Generates password based on values specified
 */
function generatePassword(passwordLength, numbersLength, symbolsLength, optionsLength, caps, mix) {
    var passwordOptions;
    var trimValue = numbersLength + symbolsLength;
    // Password Options
    for (var o = 0; o < optionsLength; o++) {
        var password = [];
        var word = passwordLength - trimValue;
        var precedence = rand(2);
        // Word Creator
        for (var x = 0; x < word; x++) {
            if (x < 2 || x > word - 4) {
                password.push(doubleSegment(caps, precedence));
                x = x + 1;
            }
            else if (x >= 2 && x <= word - 4) {
                if ((word - x) % 3 == 0) {
                    password.push(tripleSegment(caps, precedence));
                    x = x + 2;
                }
                else if ((word - x) % 4 == 0) {
                    var segment = '';
                    var doubleOrQuadruple = rand(2);
                    if (doubleOrQuadruple == 0) {
                        segment = doubleSegment(caps, precedence);
                        segment += doubleSegment(caps, precedence);
                    }
                    else {
                        segment = quadrupleSegment(caps, precedence);
                    }
                    password.push(segment);
                    x = x + 3;
                }
                else if ((word - x) % 2 == 0) {
                    var segment = '';
                    var doubleOrVowels = rand(2);
                    if (doubleOrVowels == 0) {
                        segment = doubleSegment(caps, precedence);
                    }
                    else {
                        segment = setLetter(syllables.doubleVowels);
                    }
                    password.push(segment);
                    x = x + 1;
                }
                else if ((word - x) % 1 == 0) {
                    // If it's prime!
                    var segment = setLetter(syllables.singleVowels);
                    password.push(segment);
                }
            }
        }
        // Symbol Creator        
        for (var z = 0; z < symbolsLength; z++) {
            var randomSymbols = rand(syllables.symbols.length);
            password.push(syllables.symbols[randomSymbols]);
        }
        // Number Creator
        for (var y = 0; y < numbersLength; y++) {
            var randomNumbers = rand(syllables.numbers.length);
            password.push(syllables.numbers[randomNumbers]);
        }
        if (mix) {
            var shuffledPass = shuffleArray(password);
            passwordOptions += shuffledPass.join('') + '\n';
        }
        else {
            passwordOptions += password.join('') + '\n';
        }
    }
    console.log(passwordOptions);
}
function doubleSegment(caps, precedence) {
    var consonant = capConsonant(setLetter(syllables.singleConsonants), caps);
    var vowel = setLetter(syllables.singleVowels);
    var segment = '';
    if (precedence) {
        segment += consonant;
        segment += vowel;
    }
    else {
        segment += vowel;
        segment += consonant;
    }
    return segment;
}
function tripleSegment(caps, precedence) {
    var consonant = capConsonant(setLetter(syllables.doubleConsonants), caps);
    var vowel = setLetter(syllables.singleVowels);
    var segment = '';
    if (precedence) {
        segment += consonant;
        segment += vowel;
    }
    else {
        segment += vowel;
        segment += consonant;
    }
    return segment;
}
function quadrupleSegment(caps, precedence) {
    var consonant = capConsonant(setLetter(syllables.doubleConsonants), caps);
    var vowel = setLetter(syllables.doubleVowels);
    var segment = '';
    if (precedence) {
        segment += consonant;
        segment += vowel;
    }
    else {
        segment += vowel;
        segment += consonant;
    }
    return segment;
}
function capConsonant(consonant, caps) {
    if (consonant.length < 2) {
        return consonant = caps ? consonant.toUpperCase() : consonant;
    }
    else {
        return consonant = caps ? consonant.charAt(0).toUpperCase() + consonant.slice(1) : consonant;
    }
}
function shuffleArray(arr) {
    var id = arr.length;
    while (0 !== id) {
        var randomId = rand(id);
        id -= 1;
        var tmp = arr[id];
        arr[id] = arr[randomId];
        arr[randomId] = tmp;
    }
    return arr;
    // https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
}
function setLetter(letterOptions) {
    var isChecking = true;
    var letter = '';
    var blacklist = [];
    while (isChecking) {
        var thisOption = rand(letterOptions.length);
        var letterSet = letterOptions[thisOption];
        if (weightCheck(letterSet[1])) {
            letter = letterSet[0];
            isChecking = false;
        }
    }
    return letter;
}
function weightCheck(weight) {
    var d20 = rand(20) + 1;
    if (yargs.argv.unweighted || d20 >= weight) {
        return true;
    }
    return false;
}
