#!/bin/sh
PATH=~/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/X11/bin:/usr/local/git/bin:/usr/local/Cellar/node/10.7.0/bin:$PATH

date +"%D %T" &&
  cd ~/Development/creamcityscene.com &&
  /usr/local/bin/node ./cache-artists.js &&
  /usr/local/bin/node ./build-playlist.js &&
  /usr/local/bin/npm run deploy &&
  cd ./site &&
  npx gatsby build &&
  npx surge ./public creamcityscene.com