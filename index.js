'use strict'
const path = require('path');
 const fs = require("promise-fs");
const generateList  = require(path.join(__dirname, 'bin', 'getOldContent'))
const updateQumlQuestion  = require(path.join(__dirname, 'bin', 'updateQUMLdata'))
const publishContent  = require(path.join(__dirname, 'bin', 'createItemset'))
const constants = require( path.join(__dirname, 'constants'))
const args = require('minimist')(process.argv.slice(2))

if(args.x == 'get'){
    console.log("1:-" + "\u001B[1m" + "\u001B[32m" +"Generating CSV for old QUML content" + "\u001B[0m")
    generateList.generateContentList();
} else {
    batchProcess()
}

function batchProcess() {
    (async () => {
        try {
            const files = await fs.readdir(constants.content_csv_folder_rath);
            for (const file of files) {
                const fromPath = path.join(constants.content_csv_folder_rath, file);
                const stat = await fs.stat(fromPath);
                if (stat.isFile()){
                    // console.log("'%s' is a file.", fromPath);
                    if(path.extname(fromPath) == ".csv"){
                        await startMigration(fromPath)
                    }
                }
                else if (stat.isDirectory()){
                    // console.log("'%s' is a directory.", fromPath);
                }
                
            }
        } catch (e) {
            console.error("error on reading folder!", e);
        }
    })();
}

function startMigration(fromPath) {
    switch(args.x) {
    case 'update': // update content details
        console.log("2:-" + "\u001B[1m" + "\u001B[32m" +"Updating old QUML content to New QUML content" + "\u001B[0m")
        // fetch QUML version 0.5 version question attached to content and upgrade to QUML 1.0
        updateQumlQuestion.updateQumlQuestion(fromPath);
      break;
    case 'publish':  // publish content details
        console.log("3:-" + "\u001B[1m" + "\u001B[32m" +"Publishing updated content" + "\u001B[0m")
        // create Itemset from items/question 
        // update content with itemset
        // publish content if status is live
        publishContent.publishContent(fromPath);
        break;
    default:
      console.log("\u001B[1m" + "\u001B[32m" +"Nothing to do check the script" + "\u001B[0m")
  }

}









