#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT=`dirname "$DIR"`

if [ ! -d $PWD/logs ]; then
  mkdir -p $PWD/logs
  touch $PWD/logs/arbitrage.log
fi

docker run -ti \
  -v $PARENT/src:/usr/app/src \
  -v $PWD/logs/arbitrage.log:/tmp/cash.js/arbitrage.log \
  -e LOG_DIR=/tmp/cash.js \
  --env-file $PARENT/.env \
  ubarbaxor/`basename $PARENT`
