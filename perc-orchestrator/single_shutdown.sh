#!/bin/bash

CURR_DIR=`pwd`
SCRIPT=`which $0`
BASEDIR=$(dirname $SCRIPT)

cd $BASEDIR
BASEDIR=`pwd`

FOREVER_PROCESS=`ps -ef|grep "$BASEDIR"|grep .forever|grep -v grep|awk '{print $2}'`

if [ -n "$FOREVER_PROCESS" ]; then
	FOREVER_PROCESS_ID=`ps -ef|grep "$BASEDIR"|grep .forever|grep -v grep|awk '{print $10}'`
	forever stop $FOREVER_PROCESS_ID
	if [ $? -eq 0 ];then
		echo "NODE Process is shutdown."
	else 
		echo "Error while stoping NODE Process."
		exit 1;
	fi	
else
	echo -e "No NODE Process Running at $BASEDIR\n=============================="
fi

cd $CURR_DIR