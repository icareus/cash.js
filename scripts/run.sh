#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT=`dirname "$DIR"`

if [ ! -d $PWD/logs ]; then
  mkdir -p $PWD/logs
  touch $PWD/logs/
fi

docker run -ti \
  -v $PARENT/src:/usr/app/src \
  -p 80:3000 \
  -v $PWD/logs/:/tmp/cash.js/ \
 \
  --env-file $PARENT/.env \
  ubarbaxor/`basename $PARENT`
