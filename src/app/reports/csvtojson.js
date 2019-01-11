const csv = require('csvtojson')
const fs = require('fs')
const _ = require('lodash');


const files = [
  'usage/andhrapradesh/report.csv',
  'usage/maharashtra/report.csv',
  'usage/rajasthan/report.csv',
  'usage/tamilnadu/report.csv',
  'usage/uttarpradesh/report.csv'
]

/*
const files = [
  'public/andhrapradesh/usage.csv'
]*/

function writeJSON(filePath, data) {

  var res = {
    keys: _.keys(data[0]),
    data: {},
    tableData: {}
  }
  _.each(res.keys, function (key) {
    res.data[key] = _.map(data, key);
  });

  let file = fs.readFileSync(filePath)
  const csvStr = new String(file)
  csv({ noheader: false, output: 'csv' }).fromString(csvStr).then((csvRow) => {
    res.tableData = csvRow;
    fs.writeFile(filePath.replace('.csv', '.json'), JSON.stringify(res), function (err) {
      if (err) console.log('Error', err)
      console.log('The file has been saved!')
    })
  })

}

files.forEach(function (filePath) {
  csv().fromFile(filePath).then(function (data) { writeJSON(filePath, data) })

})
