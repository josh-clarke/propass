# Developer Notes

This repository has been a learning experience for me on using NodeJS, ES6+, Typescript, and modern developer workflows. This Markdown file offers some insight into the files in this repository and a list of some resources that I have referenced.

## File Notes

This offers some explanation definition of the files in this project. It includes basic and more advanced notes. 

* [`.gitignore`](https://github.com/josh-clarke/propass/blob/main/.gitignore) - This is a simple hidden text file to tell the `git` version control system what files or directories to ignore.

```
*.DS_Store*       # Ignore MacOS folder preferences file
node_modules/*    # Ignore the installed node module files. It's far more practical
                  # to commit the `package*.json` files and call `npm install` after 
                  # a new `git clone`.
build/*           # Ignore the binary builds folder. It's unneccessary to commit these
                  # when you can just build them if and when you need them.
```

* [`babel.config.json`](https://github.com/josh-clarke/propass/blob/main/babel.config.json) - This file lets the Babel compiler know some project specific options for compiling this project.

Here, we let Babel know it is converting from TypeScript

```json
{
  "presets": [
    ["@babel/preset-typescript"],   
```

Then we tell Babel to output JavaScript that is compatible with the latest node.js

```json
    ["@babel/preset-env", {
      "targets": {
        "node": "current"           
```

* [`build.sh`](https://github.com/josh-clarke/propass/blob/main/build.sh) - This is a `bash` shell script that builds and packages the standalone binaries for MacOS, Linux, and Windows. It requires that the node.js module `pkg` is installed globally. 

```bash
# build.sh

#!/usr/bin/env bash

##
# Check if the 'pkg' command is available to the system. If it is
# not found, write a message to the terminal and quit.

if ! command -v pkg &> /dev/null
then
    echo "The command 'pkg' could not be found.\n\nPlease install with 'npm install -g pkg' and try again."
    exit
fi

##
# Use the 'pkg' command to compile the propass.js script into a binary
# and output it in a folder for its platform.
# 
# `--out-path` specifies the output path relative to the project directory
#
# `-t` specifies the version of node.js to use. 'latest-*' uses the latest
#    available to pkg for the platform.

pkg --out-path ./build/propass-win -t latest-win ./dist/propass.js && \
pkg --out-path ./build/propass-mac -t latest-macos ./dist/propass.js && \
pkg --out-path ./build/propass-lin -t latest-linux ./dist/propass.js && \

##
# Use the 'zip' command to bundle the executable, the README.md and the
# LICENSE together. 
# 
# `-j` tells 'zip' to ignore directory information in the .zip archive

zip -j ./build/propass-win/propass-windows.zip ./build/propass-win/propass.exe README.md LICENSE && \
zip -j ./build/propass-mac/propass-macos.zip ./build/propass-mac/propass README.md LICENSE && \
zip -j ./build/propass-lin/propass-linux.zip ./build/propass-lin/propass README.md LICENSE && \

##
# Copy .zip archives into the root of ./build for easier access.

cp ./build/propass-win/propass-windows.zip ./build && \
cp ./build/propass-mac/propass-macos.zip ./build && \
cp ./build/propass-lin/propass-linux.zip ./build && \

##
# Let us know it's all done!

echo "Build complete."

```

_Additional notes coming soon._

## Resources

* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

* Spencer, Tom. [_It's 2020: Let's build a node.js app with TypeScript_](https://www.tomspencer.dev/blog/2020/05/22/its-2020-lets-build-a-node.js-app-with-typescript/). Tom Spencer, 22 May 2020.

* [_How to Randomize (shuffle) a JavaScript Array_](https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html). W3Docs.