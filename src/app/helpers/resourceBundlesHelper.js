'use strict';
const path = require('path'),
  fs = require('fs'),
  ngConfig = require('ng-config'),
  properties = require("properties"),
  _ = require('lodash'),
envHelper = require('./environmentVariablesHelper.js'),
  appName = 'playerApp',
  resBundlesArr = [
    { name: 'frmelmnts', path: './resourcebundles/data/formElements/', dest: './common/js/' },
    { name: 'messagess', path: './resourcebundles/data/messages/', dest: './common/js/' },
  ];




const readFiles = function(dirname) {

  const readDirPr = new Promise(function(resolve, reject) {
    fs.readdir(dirname,
      function(err, filenames) {
        (err) ? reject(err): resolve(filenames)
      });
  });

  return readDirPr.then(function(filenames) {
    return Promise.all(filenames.map(function(filename) {
      return new Promise(function(resolve, reject) {
        fs.readFile(dirname + filename, 'utf-8', function(err, content) {
          if (err) {
            reject(err);
          } else {
            var fn = path.basename(filename, ".properties");
            var resp = { name: fn, content: content };
            resolve(resp);
          }
        });
      });
    })).catch(function(error) {
      Promise.reject(error);
    });
  });

};

function fillObject(from, to) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      if (Object.prototype.toString.call(from[key]) === '[object Object]') {
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




var buildResources = function(cb) {
  var promises = [];
  resBundlesArr.forEach(function(item) {
    promises.push(buildBundle(item));
  });
  Promise.all(promises).then(function(res) {
    cb(null, true);
  }, function(error) {
    cb(error, null);
  });


};

var buildBundle = function(item) {
  return new Promise(function(resolve, reject) {
    readFiles(item.path).then(function(allContents) {
      var resObj = {};
      var options = {
        sections: true,
        comments: "#", //Some INI files also consider # as a comment, if so, add it, comments: [";", "#"] 
        separators: "=",
        strict: true,
        // path: true
      };

      allContents.forEach(function(contentObj) {
        var obj = properties.parse(contentObj.content, options);
        resObj[contentObj.name] = obj;
      });


      _.forEach(resObj, function(langObj, langKey) {
        if (resObj[envHelper.PORTAL_DEFAULT_LANGUAGE] && langKey !== envHelper.PORTAL_DEFAULT_LANGUAGE) {
          fillObject(resObj[envHelper.PORTAL_DEFAULT_LANGUAGE], resObj[langKey]);
        }
      });

      var constObj = {};
      constObj[item.name] = resObj;
      var configOptions = {
        constants: constObj,
        module: appName + '.' + item.name
      };

      var config = ngConfig(configOptions);
      fs.writeFileSync(item.dest + item.name + '.js', config);
      resolve(true);

    }, function(error) {
      reject(error);
    });
  });
}


module.exports = {
  buildResources: buildResources
}
