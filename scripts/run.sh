#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT=`dirname "$DIR"`

if [ ! -d $PWD/logs ]; then
  mkdir -p $PWD/logs
  touch $PWD/logs/arbitrage.log
fi

docker run -ti \
  -v $PARENT/src:/usr/app/src \
  --env-file $PARENT/.env \
  -p 8000:3000 \
  --restart on-failure \
 \
  -e LOG_DIR=/tmp/cash.js \
  -v $PWD/logs/:/tmp/cash.js/ \
  ubarbaxor/`basename $PARENT`
