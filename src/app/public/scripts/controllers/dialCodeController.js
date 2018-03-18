(function () {
  angular.module('loginApp').controller('dialCodeController', ['$state', '$timeout',
    'contentService', '$rootScope', '$stateParams', 'toasterService',
    function ($state, $timeout, contentService, $rootScope, $stateParams, toasterService) {
      console.log('dialCodeController intialized')
      var dialctrl = this
      dialctrl.appFooter = false
      dialctrl.loader = {
        showLoader: true,
        loaderMessage: '',
        enrollLoader: false
      }
      dialctrl.searchKeyword = null

      dialctrl.search = function (dialcodes) {
        if (dialctrl.searchKeyword) {
          var params = {
            dialcode: dialctrl.searchKeyword
          }
          $state.go('dialCode', params)
        } else {
          // show message
        }
      }
      dialctrl.compositeSearch = function (dialcodes) {
        var req = {
          'request': {
            'filters': {
              'dialcodes': dialcodes
            }
          }
        }
        dialctrl.playContent = function (item) {
          var params = { id: item.identifier}
          $state.go('PublicContent', params)
        }

        dialctrl.openCourseView = function (course) {
          var params = { courseId: course.identifier}
          $state.go('PublicCourse', params)
        }
        contentService.search(req).then((res) => {
          if (res && res.responseCode === 'OK') {
            if (res.result.content && res.result.content.length > 0) {
              dialctrl.searchResults = res.result.content
            } else {
              toasterService.error('no content found')
            }
          } else {
            toasterService.error($rootScope.messages.fmsg.m0049)
          }
          dialctrl.loader.showLoader = false
        }, function (err) {
          toasterService.error($rootScope.messages.fmsg.m0049)
        })
      }

      dialctrl.init = function () {
        dialctrl.dialcode = $state.params.dialcode
        if (dialctrl.dialcode) {
          dialctrl.compositeSearch(dialctrl.dialcode)
        } else {
          // show message
        }
      }

      dialctrl.init()
    }])
}())
