'use strict'

angular.module('playerApp')
    .service('dataService', function () {
     /**
    * @class dataService
     * @desc Service to set and get data.
     * @memberOf Services
     */
      var data = {}
            /**
             * @method setData
             * @desc Set data
             * @memberOf Services.dataService
             * @param {string}  key - Key
             * @param {Object}  value - Data
             * @instance
             */
      this.setData = function (key, value) {
        data[key] = value
      }

        /**
             * @method getData
             * @desc Get data
             * @memberOf Services.dataService
             * @param {string}  key - Key
             * @returns {Object}  Data
             * @instance
             */
      this.getData = function (key) {
        return data[key]
      }
    })
