#!/bin/bash
set -eo pipefail

#docker run -v $PWD:/esptool-js -p 9090:9090 -it node:bullseye bash

cd /esptool-js
npm install
npm run build
python3 -m http.server 9090

