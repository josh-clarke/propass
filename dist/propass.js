#!/usr/bin/env node
"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _randomSeed = _interopRequireDefault(require("random-seed"));

var _syllables = _interopRequireDefault(require("./syllables.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const syllables = _syllables.default;

const rand = _randomSeed.default.create();

const argv = _yargs.default.scriptName('propass').usage('$0 <cmd> [args]').example([['$0', 'Generates 3 password options with the defaults'], ['$0 -l 18', 'Generates 3 password options wthat are 18 characters long'], ['$0 -p 10 -s 2 -n 3 -c', 'Generates 10 password options with 2 symbols, 3 numbers, and capitals'], ['$0 -p 5 -mc', 'Generates 5 password options with capital letters and the numbers and symbols mixed in']]).option('p', {
  alias: 'passwords',
  default: 3,
  describe: 'How many password options',
  type: 'number'
}).option('l', {
  alias: 'length',
  default: 13,
  describe: 'Total characters in password',
  type: 'number'
}).option('n', {
  alias: 'numbers',
  default: 2,
  describe: 'Number characters in password',
  type: 'number'
}).option('s', {
  alias: 'symbols',
  default: 1,
  describe: 'Symbol characters in password',
  type: 'number'
}).option('c', {
  alias: 'caps',
  default: false,
  describe: 'Include capitals',
  type: 'boolean'
}).option('m', {
  alias: 'mix',
  default: false,
  describe: 'Mix the symbols and numbers randomly into the password',
  type: 'boolean'
}).option('w', {
  alias: 'unweighted',
  default: false,
  describe: 'Ignore the weighting for letter selection',
  type: 'boolean'
}).requiresArg(['p', 'l', 'n', 's']).strictOptions().check((argv, options) => {
  if (argv.p < 1 || argv.p > 250) {
    throw new Error('Please specify a number of passwords between 1 and 250.\n\n“Form is emptiness; emptiness is form. Emptiness is none other than form; form is none other than emptiness.” —The Heart Sutra');
  } else if (argv.l < 10 || argv.l > 128) {
    throw new Error('Please specify a password length of 10 or greater and up to 128.');
  } else if (argv.n < 0) {
    throw new Error('Please specify zero or a positive amount of number characters.');
  } else if (argv.s < 0) {
    throw new Error('Please specify zero or a positive amount of symbol characters.');
  } else if (argv.n + argv.s > argv.l) {
    throw new Error('Please specify a total amount of numbers and symbols are equal to or less than the total length of the password.');
  } else if (isNaN(argv.p) || isNaN(argv.l) || isNaN(argv.n) || isNaN(argv.s)) {
    throw new Error('Only numbers are accepted as input values.');
  } else {
    return true;
  }
}).showHelpOnFail(false, 'Specify --help for available options').help().argv;

generatePassword(argv.l, argv.n, argv.s, argv.p, argv.c, argv.m);

function generatePassword(passwordLength, numbersLength, symbolsLength, optionsLength, caps, mix) {
  let passwordOptions = '';
  const trimValue = numbersLength + symbolsLength; // Password Options

  for (let o = 0; o < optionsLength; o++) {
    const password = [];
    const word = passwordLength - trimValue;
    const precedence = rand(2); // Word Creator

    for (let x = 0; x < word; x++) {
      if (x < 2 || x > word - 4) {
        password.push(doubleSegment(caps, precedence));
        x = x + 1;
      } else if (x >= 2 && x <= word - 4) {
        if ((word - x) % 3 === 0) {
          password.push(tripleSegment(caps, precedence));
          x = x + 2;
        } else if ((word - x) % 4 === 0) {
          let segment;
          const doubleOrQuadruple = rand(2);

          if (doubleOrQuadruple === 0) {
            segment = doubleSegment(caps, precedence);
            segment += doubleSegment(caps, precedence);
          } else {
            segment = quadrupleSegment(caps, precedence);
          }

          password.push(segment);
          x = x + 3;
        } else if ((word - x) % 2 === 0) {
          let segment;
          const doubleOrVowels = rand(2);

          if (doubleOrVowels === 0) {
            segment = doubleSegment(caps, precedence);
          } else {
            segment = setLetter(syllables.doubleVowels);
          }

          password.push(segment);
          x = x + 1;
        } else if ((word - x) % 1 === 0) {
          // If it's prime!
          const segment = setLetter(syllables.singleVowels);
          password.push(segment);
        }
      }
    } // Symbol Creator


    for (let z = 0; z < symbolsLength; z++) {
      const randomSymbols = rand(syllables.symbols.length);
      password.push(syllables.symbols[randomSymbols]);
    } // Number Creator


    for (let y = 0; y < numbersLength; y++) {
      const randomNumbers = rand(syllables.numbers.length);
      password.push(syllables.numbers[randomNumbers]);
    }

    if (mix) {
      const shuffledPass = shuffleArray(password);
      passwordOptions += shuffledPass.join('') + '\n';
    } else {
      passwordOptions += password.join('') + '\n';
    }
  }

  console.log(passwordOptions);
}

function doubleSegment(caps, precedence) {
  const consonant = capConsonant(setLetter(syllables.singleConsonants), caps);
  const vowel = setLetter(syllables.singleVowels);
  let segment = '';

  if (precedence) {
    segment += consonant;
    segment += vowel;
  } else {
    segment += vowel;
    segment += consonant;
  }

  return segment;
}

function tripleSegment(caps, precedence) {
  const consonant = capConsonant(setLetter(syllables.doubleConsonants), caps);
  const vowel = setLetter(syllables.singleVowels);
  let segment = '';

  if (precedence) {
    segment += consonant;
    segment += vowel;
  } else {
    segment += vowel;
    segment += consonant;
  }

  return segment;
}

function quadrupleSegment(caps, precedence) {
  const consonant = capConsonant(setLetter(syllables.doubleConsonants), caps);
  const vowel = setLetter(syllables.doubleVowels);
  let segment = '';

  if (precedence) {
    segment += consonant;
    segment += vowel;
  } else {
    segment += vowel;
    segment += consonant;
  }

  return segment;
}

function capConsonant(consonant, caps) {
  if (consonant.length < 2) {
    return caps ? consonant.toUpperCase() : consonant;
  } else {
    return caps ? consonant.charAt(0).toUpperCase() + consonant.slice(1) : consonant;
  }
}

function setLetter(letterOptions) {
  let isChecking = true;
  let letter = '';

  while (isChecking) {
    const thisOption = rand(letterOptions.length);
    const group = letterOptions[thisOption];

    if (weightCheck(group.weight)) {
      letter = group.char;
      isChecking = false;
    }
  }

  return letter;
}

function weightCheck(weight) {
  const d20 = rand(20) + 1;

  if (argv.w || d20 >= weight) {
    return true;
  }

  return false;
}

function shuffleArray(arr) {
  let id = arr.length;

  while (id !== 0) {
    const randomId = rand(id);
    id -= 1;
    const tmp = arr[id];
    arr[id] = arr[randomId];
    arr[randomId] = tmp;
  }

  return arr;
}