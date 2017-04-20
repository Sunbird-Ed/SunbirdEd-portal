#!/bin/bash

CURR_DIR=`pwd`
SCRIPT=`which $0`
BASEDIR=$(dirname $SCRIPT)

cd $BASEDIR
BASEDIR=`pwd`

FOREVER_PROCESS=`ps -ef|grep "$BASEDIR"|grep forever|grep -v grep|awk '{print $2}'`

if [ -n "$FOREVER_PROCESS" ]; then
	echo -e "==============================\nNODE is already running at $BASEDIR. Process(es) - \n$FOREVER_PROCESS"
	echo -e "Stop NODE using ./single_shutdown.sh before you run this command\n=============================="
	exit 1 
fi

echo -e "==============================\nStarting NODE at $BASEDIR..."
rm -f $HOME/.forever/PERCP_LOGFILE.log
forever start -l PERCP_LOGFILE.log $BASEDIR/app.js
echo -e "NODE start initiated at $BASEDIR.\n=============================="

cd $CURR_DIR

