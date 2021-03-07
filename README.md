# Pronounceable Password Generator

Pronounceable Password Generator is a node.js script that generates strings of characters in the command line that are ordered in a way that is pronounceable and possibly easier to remember if you wish to memorize them.

It could also be used for creating random usernames or for anything where you might want a unique pronounceable string.

This script has been converted to [TypeScript](https://typescriptlang.org) and is compiled to ESNext JavaScript with [Babel](https://babeljs.io/). The script to run with node.js is under the `./dist` directory.

<img alt="Screenshot of propass.js being used in the terminal." title="Warning: Using these samples as passwords is not recommended!" src="/screenshot.png">

## Contents

* [Installation](#installation)
  * [Binary Releases](#binary-releases)
  * [Run as a node.js Script](#run-as-a-node.js-script)
* [Quick Start](#quick-start)
* [Advanced Usage](#advanced-usage)
  * [Number of Passwords](#number-of-passwords)
  * [Password Length](#password-length)
  * [Numbers and Symbols](#numbers-and-symbols)
  * [Capital Letters](#capital-letters)
  * [Mixed Passwords](#mixed-passwords)
* [Usage Examples](#usage-examples)
* [Customization](#customization)
* [Build Binaries from Source](#build-binaries-from-source)
* [Included Modules](#included-modules)
* [License](#license)

## Installation

### Binary Releases

The latest releases have been packaged as standalone binaries for [MacOS](https://github.com/josh-clarke/propass/releases/latest), [Linux](https://github.com/josh-clarke/propass/releases/latest), and [Windows](https://github.com/josh-clarke/propass/releases/latest).

1. Download the [latest release](https://github.com/josh-clarke/propass/releases/latest) zip file for your operating system.
2. Unzip the file where you would like to keep it.
3. Use your terminal to enter the propass directory.

On MacOS and Linux, you may need to `chmod +x propass` to make it executable. If you will be using `propass` often, you might wish to place it in your PATH.

### Run as a node.js Script

**Note**: node.js should already be [installed](https://node.js.dev/learn/how-to-install-node.js) on your system.

```cli
git clone https://github.com:josh-clarke/propass.git
cd propass
npm install
```

> To run `propass` as a node.js script, you must type `node ./dist/propass.js` to execute it. In a Bash/ZSH shell you should also be able to `chmod +x ./dist/propass.js` and then execute `./dist/propass.js` directly. 

## Quick Start

Calling the `propass` binary on its own generates three password options with the default settings.

```cli
./propass
```

The full default settings are:

* **3** password options 
* **13** character length
* **1** symbol
* **2** numbers
* lowercase letters will fill out the remaining length

You can view all the options and some examples with the `--help` flag.

```cli
./propass --help
```

> When you have chosen your password, I recommend executing the `clear` command to wipe the password options from the terminal display. **Note:** This will also wipe any other output from the the terminal that you have entered this session.


## Advanced Usage

### Number of Passwords
You can set how many password options you get with the `--passwords` or `-p` flag. The example will list 25 passwords.

```cli
./propass --passwords 25
```

### Password Length
The length of the password options can be changed with the `--lengthpass` or `-l` flag. The example will list passwords that are 20 characters long.

```cli
./propass --lengthpass 20
```

> One source suggests that a good password is [at least 12 characters](https://resources.infosecinstitute.com/topic/password-security-complexity-vs-length/). Another suggests that a [16 character all lowercase password would take 208 billion minutes to crack](https://specopssoft.com/blog/password-length-best-practices/) with today's computers.

### Numbers and Symbols

The amount of numbers or symbols in a password can be set with `--numbers` or `-n` and `-symbols` or `-s`, respectively. Keep in mind that these options do not change the total length of the password, so additional numbers and symbols will reduce the number of letters in the password unless you lengthen the password.

The example creates passwords that include 3 numbers and 3 symbols. The length has also been set to 16 total characters.

```cli
./propass --symbols 3 --numbers 3 --lengthpass 16
```

### Capital Letters
If you need capitals, you can call the `--caps` or `-c` flag. This will capitalize the first consonants of a syllable, which typically results in 3 capitals for passwords using the default settings. 

```cli
./propass --caps
```

### Mixed Passwords
If you want the numbers and symbols randomly mixed into the password, you can call the `--mix` or `-m` flag. This may reduce pronounceability.

```cli
./propass --mix
```

## Usage Examples

These examples all use the short flags, which are easier to type. You can view these examples using the `--help` flag.

```cli
propass                          # Generates 3 password options 
                                 with the default settings
propass -l 18                    # Generates 3 password options 
                                 that are 18 characters long
propass -p 10 -s 2 -n 3 -c       # Generates 10 password options 
                                 with 2 symbols, 3 numbers, and 
                                 capitals mixed with lowercase
propass -p 5 -mc                 # Generates 5 password options 
                                 with capital letters and the 
                                 numbers and symbols mixed in
```
## Customization

The generator relies on a JSON file called [`syllables.json`](https://github.com/josh-clarke/propass/blob/main/syllables.json) which can be modified to add or remove consonants, vowels, numbers, and symbols. 

The letters are weighted. Essentially the script rolls a <abbr title="Twenty-sided die">d20</abbr> to determine whether the randomly selected letter is used. If not, it randomly picks a new letter and tries again. The letters are roughly weighted by their use in English, with weight ratings from 1 to 20. A low number means the letter will be selected more often and a high number means it will be selected less often.

The `--unweighted` or `-w` flag can be used to ignore the letter weights.

> **Note:** The binary version of this script bundles `syllables.json` into itself. If you want to modify the `syllables.json`, you can `git clone` and hack the code, and then [build the binaries from source](#build-binaries-from-source).


## Build Binaries from Source

1. Clone the repository.

```cli
git clone https://github.com:josh-clarke/propass.git
```

2. Enter the directory and install the node module dependencies.

```cli
cd propass
npm install
```

3. Enter the `./src` directory and make any changes that you want to the `propass.ts` file or `syllables.json` file.

4. Install the node.js module [`pkg`](https://www.npmjs.com/package/pkg) if you do not already have it. It is used to build the binaries.

```cli
npm install -g pkg
```

5. Run `npm run compile` to compile the TypeScript source into ESNext JavaScript. 

6. Run `npm run build` in a MacOS or Linux terminal, or in a WSL terminal on Windows. 

By default the build script will build binaries for MacOS, Linux, and Windows and bundle them in a .zip archive with the README and LICENSE files. They will appear in a folder called `./build`. The `build.sh` script should be easy to figure out and modify to suit your needs.

## Included Modules

This script makes use of the [random-seed](https://github.com/skratchdot/random-seed) module, which is a node.js port of the [Gibson Research Corporation's Ultra-High Entropy Pseudo-Random Number Generator](https://www.grc.com/otg/uheprng.htm).

It also uses the [Yargs](https://yargs.js.org) module for beautiful handling of command line arguments.

## License

This script is licensed under the [MIT License](https://github.com/josh-clarke/propass/blob/main/LICENSE). 