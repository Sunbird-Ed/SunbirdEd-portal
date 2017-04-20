app.service('PumpUtil', ['$http', '$q', function($http, $q) {

    this.BASE_URL = "http://community-demo.sunbird.org.in:81/"; // Leave it blank if the request is routed through orchestrator
    this.CLIENT_KEY = "2XY6s1quad0TQNrX4uy_5A";
    this.FEED_URL = this.BASE_URL + "api/user/:userName/feed";
    this.COLLECTION_MEMBERS = this.BASE_URL + "api/collection/:collectionUID/members";
    this.POST_MAJOR = this.BASE_URL + "api/user/:userName/feed/major";
    this.POST_MINOR = this.BASE_URL + "api/user/:userName/feed/minor";
    this.INBOX_MAJOR_URL = this.BASE_URL + "api/user/:userName/inbox/major";
    this.INBOX_MINOR_URL = this.BASE_URL + "api/user/:userName/inbox/minor";
    this.PUMP_USER_ID = this.BASE_URL + "api/user/:userName/profile";
    this.GET_USER = this.BASE_URL + "api/user/:userName";
    this.PUMP_COLLECTION = this.BASE_URL + "api/collection/:collectionUID";
    this.GET_LISTS = this.BASE_URL + "api/user/:userName/lists/person";
    this.GET_FOLLOWERS = this.BASE_URL + "api/user/:userName/followers";
    this.GET_FOLLOWING = this.BASE_URL + "api/user/:userName/following";

    this.getPreAuthHeaders = function(userName) {
        var headers = {
            "Content-Type": "application/json",
            "Ilimi-Api-Call": "true",
            "Consumer-Key": this.CLIENT_KEY,
            "Authorization": "OAuth"
        };
        if (userName) {
            headers['User-Name'] = userName;
        }
        return headers;
    }

    this.call = function(url, method, userName, args) {
        method = method || 'POST';
        var req = {
            method: method,
            url: url,
            headers: this.getPreAuthHeaders(userName)
        }
        if (method == 'GET') {
            req.params = args;
        } else {
            req.data = args;
        }
        var deferred = $q.defer();
        $http(req).success(function(data) {
            deferred.resolve(data);
        }).error(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
}]);