# Developer Notes

This repository has been a learning experience for me on using NodeJS, ES6+, Typescript, and modern developer workflows. This Markdown file offers some insight into the files in this repository and a list of some resources that I have referenced.

## File Notes

This offers a light definition of the files. It includes basic and more advanced notes. 

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

```json
{
  "presets": [
    ["@babel/preset-typescript"],   // Let Babel know it is converting from TypeScript
    ["@babel/preset-env", {
      "targets": {
        "node": "current"           // Output JavaScript that is compatible with the latest node.js
      }
    }]
  ]
}
```

* [`build.sh`](https://github.com/josh-clarke/propass/blob/main/build.sh) - This is a `bash` shell script that build and packages the standalone binaries for MacOS, Linux, and Windows. It requires that the node.js module `pkg` is installed globally. f

```bash:build.sh

```

_Additional notes coming soon._

## Resources

* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

* Spencer, Tom. [_It's 2020: Let's build a node.js app with TypeScript_](https://www.tomspencer.dev/blog/2020/05/22/its-2020-lets-build-a-node.js-app-with-typescript/). Tom Spencer, 22 May 2020.

* [_How to Randomize (shuffle) a JavaScript Array_](https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html). W3Docs.