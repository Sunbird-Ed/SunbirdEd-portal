#!/bin/bash
echo "###################################################";
echo "Start of Minimising controllers...";
echo "###################################################";
echo "Processing.....";
CURR_DIR=`pwd`
CONTROLLERS_DIR=$CURR_DIR"/public/js/controllers";

find  $CONTROLLERS_DIR|while read fname; do
  if [[ "$fname" == *.js && "$fname" != *leaderboardController.js && "$fname" != *coachDashboardController.js && "$fname" != *communityController.js && "$fname" != *dashboardController.js && "$fname" != *tutorQAController.js && "$fname" != *notesController.js && "$fname" != *sidebarController.js ]]
  then
  	# echo -e "java -jar yuicompressor-2.4.8.jar --nomunge $fname -o $fname" >> minimise.txt;
  	`java -jar yuicompressor-2.4.8.jar --nomunge $fname -o $fname`;
  fi
done
echo "###################################################";
echo "End of Minimising controllers...";
echo -e "###################################################\n\n";

echo "###################################################";
echo "Start of Minimising CSS files...";
echo "###################################################";
echo "Processing.....";
CSS_DIR=$CURR_DIR"/public/css";

find  $CSS_DIR|while read fname; do
  if [[ "$fname" == *.css ]]
  then
  	echo -e "java -jar yuicompressor-2.4.8.jar --nomunge $fname -o $fname" >> minimise.txt;
  	`java -jar yuicompressor-2.4.8.jar --nomunge $fname -o $fname`;
  fi
done
echo "###################################################";
echo "End of Minimising CSS files...";
echo "###################################################";