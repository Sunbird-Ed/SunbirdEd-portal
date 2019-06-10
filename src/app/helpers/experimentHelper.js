const request = require('request-promise');
const fs = require('fs')
const path = require('path')

const getExperimentIndexFile = async (req, res) => {
  let indexFilePath, indexFileData;
  if(req.params.slug === 'ap'){
    indexFileData = await request.get('http://localhost:3001/dist_experiment/experiment1/index.html').catch((error) => {
      console.log('--------------fetching index file failed----------------------', error)
    })
    // fs.writeFileSync(path.join(__dirname, '../experiment', 'dist_experiment1_index.ejs'), indexFileData)
    // indexFilePath = path.join(__dirname, '../experiment', 'dist_experiment1_index.ejs');
  } else if (req.params.slug === 'rj') {
    indexFileData = await request.get('http://localhost:3001/dist_experiment/experiment2/index.html').catch((error) => {
      console.log('--------------fetching index file failed----------------------', error)
    })
    // fs.writeFileSync(path.join(__dirname, '../experiment', 'dist_experiment2_index.ejs'), indexFileData)
    // indexFilePath = path.join(__dirname, '../experiment', 'dist_experiment2_index.ejs');
  }
  return { path: indexFilePath, data: indexFileData };
}
module.exports = {
  getExperimentIndexFile
}