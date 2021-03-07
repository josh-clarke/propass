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
