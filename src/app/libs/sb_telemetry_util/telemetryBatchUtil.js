var LRU = require('lru-cache');
var { v4: uuidv4 } = require('uuid');
var fs = require('fs');
var path = require('path')

var options = {
    max: 50,
    noDisposeOnSet: true,
    dispose: dispose
};
var cache = LRU(options);

function date() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = dd + '' + mm + '' + yyyy;
    return today;
}

function dispose(key, events) {
    if (!fs.existsSync(path.join(__dirname, 'failedTelemetry'))) {
        fs.mkdirSync(path.join(__dirname, 'failedTelemetry'))
    }
    fs.appendFile(path.join(__dirname, 'failedTelemetry', 'telemetry_' + date() + '.json'), JSON.stringify(events), function (err) {
        if (err) {
            console.log('error while saving  failedTelemetry to file ,' + 'telemetry_' + date() + '.json', err)
        }
    })

}

module.exports = {

    add: function (batch) {
        cache.set(uuidv4(), batch);
    },

    get: function () {
        if (cache.keys().length <= 0) {
            return undefined;
        }
        var batches = [];
        cache.forEach(function (events, id) {
            batches.push({ id: id, events: events })
        })
        return batches;
    },

    delete: function (id) {
        cache.del(id);
    }
}

