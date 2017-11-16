var cacheManager = require('cache-manager');

/**
 * [CacheManager Constructor to set the cache config]
 * @param {[Object]} config [fields with (store, ttl)]
 */
function CacheManager(config) {
    this.ttl = config.ttl || 3600;
    this.store = config.store || 'memory';
    this.cache = cacheManager.caching({
        store: this.store,
        ttl: this.ttl
    });
}

/**
 * [set store the cache]
 * @param {[object]}   data     [key - required, value - required, ttl - optional]
 * @param {Function} callback [If error or success]
 */
CacheManager.prototype.set = function(data, callback) {

    if(typeof callback !== "function") {
        return;
    }

    var ttl = data.ttl || this.ttl;
    this.cache.set(data.key, data.value, {ttl: ttl}, function(err) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, {success : true});
        }
    });
};

/**
 * [get- the store cache]
 * @param  {[string]}   key      [cache store key]
 * @param  {Function} callback [error or cache data]
 * @return {[Function]} callback [error or cache data]
 */
CacheManager.prototype.get = function(key, callback) {

    if(typeof callback !== "function") {
        return;
    }

    this.cache.get(key, function(err, cacheData) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, cacheData);
        }
    });
};

/**
 * [delete- Delete the store cache ]
 * @param  {[string]}   key      [cache store key]
 * @param  {Function} callback [error or success]
 * @return {Function} callback [error or success]
 */
CacheManager.prototype.delete = function(key, callback) {

    if(typeof callback !== "function") {
        return;
    }

    this.cache.del(key, function(err) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, {success : true});
        }
    });
};

module.exports = CacheManager;