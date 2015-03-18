#!/bin/sh

SERVICEFILE=./service-info.txt

SRC=$(sed '5q;d' $SERVICEFILE)

echo "Setting up project:"
echo "  * installing local dependencies: (cd $SRC && npm install && bower install)"
sudo npm install ember-cli -g
(cd $SRC && npm install && bower install --allow-root)
