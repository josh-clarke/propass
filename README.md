# Pronounceable Password Generator

Pronounceable Password Generator (`propass.js`) is a NodeJS script that generates strings of characters in the command line that are ordered in a way that is pronounceable and possibly easier to remember if you wish to memorize them.

It could also be used for creating random usernames or for anything where you might want a unique pronounceable string.

<figure>
  ![Screenshot of propass.js being used in the terminal. Do not use these passwords!](/screenshot.png)
  <figcaption>Warning: Do not use these passwords!</figcaption>
</figure>

## Contents

* [Installation](#installation)
* [Quick Start](#quick-start)
* [Advanced Usage](#advanced-usage)
  * [Number of Passwords](#number-of-passwords)
  * [Password Length](#password-length)
  * [Numbers and Symbols](#numbers-and-symbols)
  * [Capital Letters](#capital-letters)
  * [Mixed Passwords](#mixed-passwords)
* [Usage Examples](#usage-examples)
* [Customization](#customization)
* [Included Modules](#included-modules)
* [License](#license)

## Installation

**Note**: NodeJS should already be [installed](https://nodejs.dev/learn/how-to-install-nodejs) on your system.

```cli
git clone https://github.com:josh-clarke/propass.git
cd propass
npm install
```

## Quick Start

Calling the script on its own generates three password options with the default settings.

```cli
node propass.js
```

The full default settings are:

* **3** password options 
* **13** character length
* **1** symbol
* **2** numbers
* lowercase letters will fill out the remaining length

You can view all the options and some examples with the `--help` flag.

```cli
node propass.js --help
```

> When you have chosen your password, I recommend executing the `clear` command to wipe the password options from the terminal display. **Note:** This will also wipe any other output from the the terminal that you have entered this session.


## Advanced Usage

### Number of Passwords
You can set how many password options you get with the `--passwords` or `-p` flag. The example will list 25 passwords.

```cli
node propass.js --passwords 25
```

### Password Length
The length of the password options can be changed with the `--lengthpass` or `-l` flag. The example will list passwords that are 20 characters long.

```cli
node propass.js --lengthpass 20
```

### Numbers and Symbols

The amount of numbers or symbols in a password can be set with `--numbers` or `-n` and `-symbols` or `-s`, respectively. Keep in mind that these options do not change the total length of the password, so additional numbers and symbols will reduce the number of letters in the password unless you lengthen the password with the `--lengthpass` flag.

The example creates passwords that include 3 numbers and 3 symbols. The length has also been set to 16 total characters.

```cli
node propass.js --symbols 3 --numbers 3 --lengthpass 16
```

### Capital Letters
If you need capitals, you can call the `--caps` or `-c` flag. This will capitalize all the consonants, which typically results in 3 capitals for passwords using the default settings. 

```cli
node propass.js --caps
```

### Mixed Passwords
If you want the numbers and symbols randomly mixed into the password, you can call the `--mix` or `-m` flag. This may reduce pronounceability.

```cli
node propass.js --mix
```

> Some sources suggest that a good password is [at least 12 characters](https://resources.infosecinstitute.com/topic/password-security-complexity-vs-length/). A[16 character all lowercase passwords would take 208 billion minutes to crack](https://specopssoft.com/blog/password-length-best-practices/) with today's computers.

> The command-line examples all use `node propass.js` for compatibility, but the script includes a hashbang. In a Bash/ZSH shell you should be able to `chmod +x propass.js` and then execute `./propass.js` directly. 

## Usage Examples

These examples all use the short flags, which are easier to type. You can view these examples using the `--help` flag.

```cli
propass.js                     # Generates 3 password options 
                                 with the default settings
propass.js -l 18               # Generates 3 password options 
                                 that are 18 characters long
propass.js -p 10 -s 2 -n 3 -c  # Generates 10 password options 
                                 with 2 symbols, 3 numbers, and 
                                 capitals mixed with lowercase
propass.js -p 5 -mc            # Generates 5 password options 
                                 with capital letters and the 
                                 numbers and symbols mixed in
```

## Customization

The generator relies on a JSON file called [`syllables.json`](https://github.com/josh-clarke/propass/blob/main/syllables.json) which can be modified to add or remove consonants, vowels, numbers, and symbols.

## Included Modules

This script makes use of the [random-seed](https://github.com/skratchdot/random-seed) module, which is a NodeJS port of the [Gibson Research Corporation's Ultra-High Entropy Pseudo-Random Number Generator](https://www.grc.com/otg/uheprng.htm).

It also uses the [Yargs](https://yargs.js.org) module for beautiful handling of command line arguments.

## License

This script is licensed under the [MIT License](https://github.com/josh-clarke/propass/blob/main/LICENSE). 