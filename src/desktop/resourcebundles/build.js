"use strict";
const path = require("path");
const fs = require("fs");
const properties = require("properties");
const _ = require("lodash");
var sunbird_primary_bundle_language = 'en';
const resBundlesArr = [
  {
    name: "consumption",
    path: path.join(__dirname, "/./../../app/resourcebundles/data/consumption/"),
    dest: path.join(__dirname, "/./../openrap-sunbirded-plugin/data/resourceBundles/")
  },{
    name: "creation",
    path: path.join(__dirname, "/./../../app/resourcebundles/data/consumption/"),
    dest: path.join(__dirname, "/./../openrap-sunbirded-plugin/data/resourceBundles/")
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
            resObj[sunbird_primary_bundle_language] &&
            langKey !== sunbird_primary_bundle_language
          ) {
            fillObject(
              resObj[sunbird_primary_bundle_language],
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

buildResources();
