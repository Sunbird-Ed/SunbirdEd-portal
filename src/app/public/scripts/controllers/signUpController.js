'use strict'

angular.module('loginApp')
  .controller('SignUpCtrl', ['signUpService', '$timeout', '$filter', '$location',
    '$rootScope', 'toasterService', function (signUpService, $timeout,
      $filter, $location, $rootScope, toasterService) {
      var newUser = this
      var today = new Date()
      newUser.languages = $rootScope.frmelmnts.lbl.languages.split(',')
      newUser.formValidation = function () {
        $('.ui.form').form({
          fields: {
            userName: {
              rules: [{
                type: 'regExp[^[-\\w\.\\$@\*\\!]{5,256}$]', // eslint-disable-line no-useless-escape ,max-len
                prompt: $rootScope.messages.stmsg.m0087
              }]
            },
            password: {
              rules: [{
                type: 'empty',
                prompt: $rootScope.messages.stmsg.m0088
              }]
            },
            firstName: {
              rules: [{
                type: 'regExp[^[0-9]*[A-Za-z\\s][0-9A-Za-z\\s]*$]',
                prompt: $rootScope.messages.stmsg.m0092
              }]
            },
            phone: {
              rules: [{
                type: 'regExp[^\\d{10}$]', // eslint-disable-line  ,max-len
                prompt: $rootScope.messages.stmsg.m0091
              }]
            },
            email: {
              rules: [{
                type: 'regExp[/^([a-zA-Z0-9_.+\\-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$/]',
                prompt: $rootScope.messages.stmsg.m0089
              }]
            },
            language: {
              rules: [{
                type: 'empty',
                prompt: $rootScope.messages.stmsg.m0090
              }]
            }
          },
          onSuccess: function () {
            return true
          },
          onFailure: function () {
            return false
          }
        })
      }

      newUser.showModal = function () {
        newUser.firstName = ''
        newUser.lastName = ''
        newUser.password = ''
        newUser.email = ''
        newUser.userName = ''
        newUser.phone = ''
        newUser.language = []

        $timeout(function () {
          // Resets form input fields from data values
          $('.ui.form').trigger('reset')
          // Resets form error messages and field styles
          $('.ui.form .field.error')
            .removeClass($rootScope.messages.emsg.m0002)
          $('.ui.form.error').removeClass($rootScope.messages.emsg.m0002)
          $('.dropdown').dropdown('clear')
          $('ui.fluid.dropdown.signupMultiple')
            .dropdown({ placeholder: 'Languages' })
          $('.ui .modal').modal('show')
          $('#signupModal').modal({
            closable: false
          })
        })

        $timeout(function () {
          $('#dobCalendar').calendar({
            type: 'date',
            maxDate: today,
            formatter: {
              date: function (date) {
                if (!date) return ''
                /*eslint-disable */
                                var day = date.getDate();
                                var month = date.getMonth() + 1;
                                var year = date.getFullYear();
                                var selectedDate =
                                    day + '/' + month + '/' + year;
                                return selectedDate;
                                  /* eslint-enable */
              }
            }
          })
        }, 1500)
      }

      newUser.formInit = function () {
        $timeout(function () {
          $('.signupMultiple')
            .dropdown()
          $('#dobCalendar').calendar({
            type: 'date',
            maxDate: today,
            formatter: {
              date: function (date) {
                if (!date) return ''
                var day = date.getDate()
                var month = date.getMonth() + 1
                var year = date.getFullYear()
                var selectedDate =
                                    day + '/' + month + '/' + year
                return selectedDate
              }
            }
          })
        }, 1500)
      }

      newUser.submitForm = function () {
        var dob = $('#dobCalendar').calendar('get date')
        newUser.dob = $filter('date')(dob, 'yyyy-MM-dd')
        newUser.formValidation()
        var isValid = $('.ui.form').form('validate form')
        if (isValid === true) { newUser.signUp() } else {
          $('.ui .modal').modal('refresh')
          return false
        }
      }
      newUser.getErrorMsg = function (errorKey) {
        var errorMessage = ''
        if (errorKey === 'USER_ALREADY_EXIST') {
          errorMessage = $rootScope.messages.stmsg.m0085
        } else if (errorKey === 'USERNAME_EMAIL_IN_USE') {
          errorMessage = $rootScope.messages.stmsg.m0086
        } else errorMessage = $rootScope.messages.emsg.m0005
        return errorMessage
      }
      newUser.signUp = function () {
        newUser.request = {
          params: {},
          request: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            password: newUser.password,
            email: newUser.email,
            userName: newUser.userName.trim(),
            phone: newUser.phone,
            language: [newUser.language]
          }
        }
        newUser.loader = toasterService.loader('', $rootScope.messages.stmsg.m0084)
        var req = newUser.request
        $('.ui .modal').modal('show')
        $('#signupModal').modal({
          closable: false
        })

        signUpService.signUp(req).then(function (successResponse) {
          if (successResponse &&
                        successResponse.responseCode === 'OK') {
            newUser.loader.showLoader = false

            $location.path('/private/index')
            newUser.loader.showLoader = false
            toasterService.success($rootScope.messages.smsg.m0039)
            $timeout(function () {
              $('.ui .modal').modal('hide')
            }, 2000)
          } else {
            newUser.loader.showLoader = false
            var errorMessage = newUser.getErrorMsg(successResponse.params.err)
            toasterService.error(errorMessage)
          }
        }).catch(function () {
          newUser.loader.showLoader = false
          toasterService.error($rootScope.messages.emsg.m0005)
        })
      }
    }])
