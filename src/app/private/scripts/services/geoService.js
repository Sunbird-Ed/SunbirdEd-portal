/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */
angular.module('playerApp')
    /**
     * @class geoService
     * @desc Service to manages geo service api calls.
     * @memberOf Services
     */
    .service('geoService', ['$rootScope', '$http', function ($rootScope, $http) {
        /**
         * @method getHeader
         * @desc Headers for api calls
         * @memberOf Services.geoService
         * @returns {Object} headers - Headers
         * @instance
         */
      this.getHeaders = function () {
        var headers = {
          'Content-Type': 'application/json',
          cid: 'sunbird'
        }
        headers.Accept = 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8'
        return headers
      }

        /**
         * @method httpCall
         * @desc to make http get api calls
         * @memberOf Services.geoService
         * @returns {Object}
         * @instance
         */
      this.httpCall = function (req, qs) {
        var instance = this
        var url = '/api/org/v1/location/read/' + req.id + '?type=organisation'
        return $http({
          method: 'GET',
          url: url,
          headers: instance.getHeaders(),
          params: qs
        })
      }

        /**
         * @method getItems
         * @desc Used to get the geo location object by making http get call.
         * @memberOf Services.geoService
         * @returns {Object}
         * @instance
         */
      this.getItems = function (req, qs) {
        var instance = this
        var request = this.httpCall(req)
        return (request.then(instance.handleSuccess, instance.handleError))
      }

        /**
         * @method handleSucess
         * @desc Which handles the sucess api call
         * @memberOf Services.geoService
         * @returns {Object}
         * @instance
         */
      this.handleSuccess = function (response) {
        return (response.data)
      }

        /**
         * @method handleError
         * @desc Which handles the errors during api invoke
         * @memberOf Services.geoService
         * @returns {Object}
         * @instance
         */
      this.handleError = function (response) {
        if (response.data && response.status === 440) {
          console.error('Error while fetching locaions')
        }
        return (response.data)
      }
    }])
