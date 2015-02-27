#!/bin/sh

SERVICEFILE=./service-info.txt

SRC=$(sed '5q;d' $SERVICEFILE)

echo "Setting up project:"
echo "  * installing local dependencies: (cd $SRC && npm install && bower install)"
(cd $SRC && npm install && bower install --allow-root)
