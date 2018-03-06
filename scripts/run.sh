#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT=`dirname "$DIR"`

if [ ! -d $PWD/public/logs ]; then
  mkdir -p $PWD/public/logs
fi

docker run -dti \
  -v $PARENT/public:/usr/app/public \
  -v $PARENT/src:/usr/app/src \
  -p 80:3000 \
  -v $PWD/logs/:/tmp/cash.js/ \
 \
  --env-file $PARENT/.env \
  ubarbaxor/`basename $PARENT`
