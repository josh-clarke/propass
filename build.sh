#!/usr/bin/env bash

if ! command -v pkg &> /dev/null
then
    echo "The command 'pkg' could not be found.\n\nPlease install with 'npm install -g pkg' and try again."
    exit
fi

pkg --out-path ./build/propass-win -t node15-win ./dist/propass.js && \
pkg --out-path ./build/propass-mac -t node15-macos ./dist/propass.js && \
pkg --out-path ./build/propass-lin -t node15-linux ./dist/propass.js && \
zip -j ./build/propass-win/propass-windows.zip ./build/propass-win/propass.exe README.md LICENSE && \
zip -j ./build/propass-mac/propass-macos.zip ./build/propass-mac/propass README.md LICENSE && \
zip -j ./build/propass-lin/propass-linux.zip ./build/propass-lin/propass README.md LICENSE && \
cp ./build/propass-win/propass-windows.zip ./build && \
cp ./build/propass-mac/propass-macos.zip ./build && \
cp ./build/propass-lin/propass-linux.zip ./build && \
echo "Build complete."
