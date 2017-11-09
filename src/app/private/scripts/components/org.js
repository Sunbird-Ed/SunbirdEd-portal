/**
 * @author Manjunath Davanam <manjunathd@ilimi.in>
 */

angular.module('playerApp').component('org', {
    require: {
        parent: '^parent'
    },
    controller: function($scope, $rootScope, $injector) {
        var instance = this;
        this.keyName = 'org';
        this.items = undefined;
        var selectedItems = {key: 'org', value: {} }
        this.$onInit = function() {
            var config = this.getConfig();
            if (this.keyAvailable()) {
                $rootScope.$on('items:from:child', function() {
                    selectedItems.value = instance.getSelectedItems();
                    instance.parent.setItem(selectedItems);
                });
                this.validateAdopter(config[this.keyName]);

            }
        };

        this.getConfig = function() {
            return this.parent.config;
        };

        this.renderItems = function(items) {
            this.items = items;
        };

        this.getSelectedItems = function() {
            return _.filter(instance.items, ['selected', true])
        };

        this.validateAdopter = function(config) {
            switch (config.adopter) {
                case 'JSON':
                    this.initializeJsonAdopter(config);
                    break;
                case 'SERVICE':
                    this.initializeServiceAdopter(config);
                    break;
                default:
                    console.error("Adopter is required.");
            }
        };
        this.initializeJsonAdopter = function(config) {
            this.renderItems(config.json);
        };
        this.initializeServiceAdopter = function(config) {
            var service = $injector.get(config.service);
            var items = service.getItems();
            this.renderItems(items);
        };

        this.keyAvailable = function() {
            return _.has(this.getConfig(), this.keyName)
        };
    },
    templateUrl: "views/components/org.html"
         
    
});