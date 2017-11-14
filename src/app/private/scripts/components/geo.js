/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */



angular.module('playerApp').component('geo', {
    /**
     * @class geocomponent
     * @desc change user settings
     * @memberOf component
     */
    require: {
        parent: '^parent'
    },
    controller: function($scope, $rootScope, $injector) {
        instance = this;
        this.keyName = 'geo';
        this.items = undefined;
        this.receipients = [];
        var selectedItems = {key: 'geo', value: {} }
        /**
         * @desc Intialization of geo component when compounent is loaded.
         */
        this.$onInit = function() {
            var instance = this;
            $rootScope.$on("component:init", function() {
                var config = instance.getConfig();
                instance.receipients = $rootScope.receipients
                if (_.has(config, instance.keyName)) {
                    instance.initialize(config);
                }
            });
        };
        /**
         * @desc Validating the adoption from config object during initialization
         * @listens 'items:from:child'
         * Parent component will fetch the selected items from the child component.
         */
        this.initialize = function(config) {
            $rootScope.$on('items:from:child', function() {
                selectedItems.value = instance.getSelectedItems();
                instance.parent.setItem(selectedItems);
            });
            config[this.keyName].adopter ? this.validateAdopter(config[this.keyName]) : console.error("Adopter is required")
        };


        /**
         * Used to get the configuration from parent comp.
         * @return {object} Config object
         */
        this.getConfig = function() {
            if (this.parent) {
                return this.parent.config;
            } else {
                console.error("Parent component is need to initialize.")
            }
        };


        /**
         * Items which is need to be render on web page
         * @param  {object} items geo items from api
         */
        this.renderItems = function(items) {
            this.items = items;
        };

        /**
         * @desc Returns the selected items
         * @return {object}
         */
        this.getSelectedItems = function() {
            return _.filter(instance.items, ['selected', true])
        };

        /**
         * Validates the adopter from config object and initializes the respective adopter based on the config
         * @param  {object} config Object need to be seend to initialize the adopter
         */
        this.validateAdopter = function(config) {
            switch (config.adopter.toUpperCase()) {
                case 'JSON':
                    this.initializeJsonAdopter(config);
                    break;
                case 'SERVICE':
                    this.initializeServiceAdopter(config);
                    break;
                default:
                    console.error("Invalid Adopter, Current supported adopters are only JSON and SERVICE.");
            }
        };

        /**
         * Initializes the JSON adopter
         * @param {object} config
         */
        this.initializeJsonAdopter = function(config) {
            this.renderItems(config.json);
        };

        /**
         * Initializes the service adopter
         * @param  {object} config Configuration to initialize the service adopter
         */
        this.initializeServiceAdopter = function(config) {
            var instance = this;
            var service = $injector.get(config.service);
            var request = {id:$rootScope.rootOrgId}
            service.getItems(request).then(function(response) {
                if (response && response.responseCode === 'OK') {
                    instance.renderItems(response.result.response);
                } else {
                    console.error("Locations are not found");
                }
            }).catch(function(error) {
                console.error("Unable to fetch the locations",error);
            })
        };
    },
    templateUrl: "views/components/geo.html"
});