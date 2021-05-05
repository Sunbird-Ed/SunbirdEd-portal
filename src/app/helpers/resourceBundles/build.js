"use strict";
const path = require("path");
const fs = require("fs");
const properties = require("properties");
const _ = require("lodash");
const envHelper = require("./../environmentVariablesHelper.js");
const args = process.argv.slice(2);
var exec = require('child_process').exec;

// PhraseApp Configuration
// const authToken = envHelper.PHRASE_APP.phrase_authToken;
// const project = envHelper.PHRASE_APP.phrase_project;
// const locale = envHelper.PHRASE_APP.phrase_locale;
// const fileformat = envHelper.PHRASE_APP.phrase_fileformat;
// const merge = true; 

const rbPatah = path.join(__dirname, '/./../../node_modules/sunbird-localization/index.js');
const resBundlesArr = [
  {
    name: "consumption",
    path: path.join(__dirname, "/./../../resourcebundles/data/consumption/"),
    dest: path.join(__dirname, "/./../../resourcebundles/json/")
  },
  {
    name: "creation",
    path: path.join(__dirname, "/./../../resourcebundles/data/creation/"),
    dest: path.join(__dirname, "/./../../resourcebundles/json/")
  }
];
const readFiles = function(dirname) {
  const readDirPr = new Promise(function(resolve, reject) {
    fs.readdir(dirname, function(err, filenames) {
      err ? reject(err) : resolve(filenames);
    });
  });

  return readDirPr.then(function(filenames) {
    return Promise.all(
      filenames.map(function(filename) {
        return new Promise(function(resolve, reject) {
          fs.readFile(dirname + filename, "utf-8", function(err, content) {
            if (err) {
              reject(err);
            } else {
              var fn = path.basename(filename, ".properties");
              var resp = { name: fn, content: content };
              resolve(resp);
            }
          });
        });
      })
    ).catch(function(error) {
      Promise.reject(error);
    });
  });
};

function fillObject(from, to) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      if (Object.prototype.toString.call(from[key]) === "[object Object]") {
        if (!to.hasOwnProperty(key)) {
          to[key] = {};
        }
        fillObject(from[key], to[key]);
      } else if (!to.hasOwnProperty(key)) {
        to[key] = from[key];
      }
    }
  }
}

var buildResources = function() {
  var promises = [];
  resBundlesArr.forEach(function(item) {
    promises.push(buildBundle(item));
  });
  Promise.all(promises).then(
    function(res) {},
    function(error) {
      console.log(error);
    }
  );
};

var buildBundle = function(item) {
  return new Promise(function(resolve, reject) {
    readFiles(item.path).then(
      function(allContents) {
        var resObj = {};
        var options = {
          sections: true,
          comments: "#", // Some INI files also consider # as a comment, if so, add it, comments: [";", "#"]
          separators: "=",
          strict: true,
          namespaces: true
          // path: true
        };
        allContents.forEach(function(contentObj) {
          var obj = properties.parse(contentObj.content, options);
          resObj[contentObj.name] = obj;
        });
        _.forEach(resObj, function(langObj, langKey) {
          if (
            resObj[envHelper.sunbird_primary_bundle_language] &&
            langKey !== envHelper.sunbird_primary_bundle_language
          ) {
            fillObject(
              resObj[envHelper.sunbird_primary_bundle_language],
              resObj[langKey]
            );
          }
        });
        _.forEach(resObj, function(data, lang) {
          try {
            var json = JSON.parse(fs.readFileSync(item.dest + lang + ".json"));
            json[item.name] = data;
            fs.writeFileSync(item.dest + lang + ".json", JSON.stringify(json));
          } catch (e) {
            if (!fs.existsSync(item.dest)) {
              fs.mkdirSync(item.dest);
            }
            fs.writeFileSync(
              item.dest + lang + ".json",
              JSON.stringify({ [item.name]: data })
            );
          }
        });
        resolve(true);
      },
      function(error) {
        reject(error);
      }
    );
  });
};

/**
 * mergeNbuildCreationResource used to build creation locale json file and merge that into locales which fetched from phrase app
 */
var mergeNbuildCreationResource = function() {
  const creationRes = {
    name: "creation",
    path: path.join(__dirname, "/./../../resourcebundles/data/creation/"),
    dest: path.join(__dirname, "/./../../resourcebundles/json/"),
    src: path.join(__dirname, "/./../../sunbirdresourcebundle/"),
  }
  return new Promise(function(resolve, reject) {
    readFiles(creationRes.path).then(
      function(allContents) {
        var resObj = {};
        var options = {
          sections: true,
          comments: "#", // Some INI files also consider # as a comment, if so, add it, comments: [";", "#"]
          separators: "=",
          strict: true,
          namespaces: true
          // path: true
        };
        allContents.forEach(function(contentObj) {
          var obj = properties.parse(contentObj.content, options);
          resObj[contentObj.name] = obj;
        });
        _.forEach(resObj, function(langObj, langKey) {
          if (
            resObj[envHelper.sunbird_primary_bundle_language] &&
            langKey !== envHelper.sunbird_primary_bundle_language
          ) {
            fillObject(
              resObj[envHelper.sunbird_primary_bundle_language],
              resObj[langKey]
            );
          }
        });
        _.forEach(resObj, function(data, lang) {
          try {
            let newData = {}
            var json = JSON.parse(fs.readFileSync(creationRes.src + lang + ".json"));
            newData['consumption'] = json;
            newData[creationRes.name] = data;
            fs.writeFileSync(creationRes.dest + lang + ".json", JSON.stringify(newData));
          } catch (e) {
            if (!fs.existsSync(creationRes.dest)) {
              fs.mkdirSync(creationRes.dest);
            }
            fs.writeFileSync(
              creationRes.dest + lang + ".json",
              JSON.stringify({ [creationRes.name]: data })
            );
          }
        });
        resolve(true);
      },
      function(error) {
        reject(error);
      }
    );
  });
};

/**
 * pullPhraseAppLocale function will fetch json locale json files from phrase app and stored in /sunbirdresourcebundle directory
 */
const pullPhraseAppLocale = function() {
  const cmd = `node ${rbPatah} -authToken="token ${authToken}" -project="${project}" -locale="${locale}" -merge="${merge}" -fileformat="${fileformat}"`;
  exec(cmd, function async(err, stdout, stderr) {
    if(!err) {
      mergeNbuildCreationResource().then(res => {
        if(res) {
          deleteFolderRecursive(path.join(__dirname, "/./../../sunbirdresourcebundle"));
        }
      });
    }
  })
}

/**
 * Function is used to delete non empty directory 
 * @param  {path} Directory path
 */
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

if (args.length && args[0].includes('-task')) {
  const task = args[0].slice(6);
  if(task === 'phraseAppPull' && authToken) {
    pullPhraseAppLocale();
  } else {
    buildResources();
  }
} else {
  buildResources();
}
