#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT=`dirname "$DIR"`

docker run -ti \
  -v $PARENT/src:/usr/app/src \
  --env-file $PARENT/.env \
  ubarbaxor/`basename $PARENT`
