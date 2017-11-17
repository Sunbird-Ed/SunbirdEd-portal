/**
 * Manjunath Davanam <manjunathd@ilimi.in>
 */

angular.module('playerApp').component('parent', {
  transclude: true,
  bindings: {
    config: '<'
  },
  templateUrl: 'views/components/parent.html',
  controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
    this.items = {}
    var instance = this
    this.$onInit = function () {
      $rootScope.$on('get:selected:items', function () {
        $rootScope.$emit('items:from:child')
        $rootScope.$emit('selected:items', instance.items)
      })
    }
    this.setItem = function (item) {
      var instance = this
      if (!_.isEmpty(item)) {
        instance.items[item.key] = item.value
      } else {
        console.warn('Item is empty')
      }
    }
  }]
})
