#!/bin/sh

IMAGENAME="local/workbench-ui"
CONTAINERNAME="workbench-ui"
DEFAULTPORT=80

HOSTPORT=$1

if [ -z "$1" ]
  then
    HOSTPORT=$DEFAULTPORT
    echo "Usage  ./docker-run HOSTPORT\n"
    echo "No HOSTPORT provided, assuming default port $DEFAULTPORT\n"
fi

echo "Removing "
docker rm -f $CONTAINERNAME

echo "\nStarted as "
docker run -d -p $HOSTPORT:$DEFAULTPORT --name $CONTAINERNAME $IMAGENAME
