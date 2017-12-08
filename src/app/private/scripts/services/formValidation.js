'use strict'

angular.module('playerApp')
  .service('formValidation', ['$rootScope', function ($rootScope) {
    /**
     * @class formValidation
     * @desc Service for validating forms.
     * @memberOf Services
     */

    var addressFields = [
      { fieldName: 'addressType', type: 'checked', prompt: $rootScope.messages.stmsg.m0062 },
      { fieldName: 'addLine1', type: 'empty', prompt: $rootScope.messages.stmsg.m0063 },
      { fieldName: 'city', type: 'empty', prompt: $rootScope.messages.stmsg.m0064 },
      { fieldName: 'pinCode', type: 'regExp[^[0-9]*$]', prompt: $rootScope.messages.stmsg.m0065 }
    ]
    var educationFields = [
      { fieldName: 'degree', type: 'empty', prompt: $rootScope.messages.stmsg.m0062 },
      { fieldName: 'institute', type: 'empty', prompt: $rootScope.messages.stmsg.m0070 },
      { fieldName: 'yearop',
        type: 'regExp[^[0-9]{4}$]',
        prompt: $rootScope.messages.stmsg.m0093
      },
      { fieldName: 'prcntg',
        optional: true,
        type: 'regExp[^[1-9][0-9]?$|^100$]',
        prompt: $rootScope.messages.stmsg.m0094
      }
    ]
    var jobProfileFields = [
      { fieldName: 'jobName', type: 'empty', prompt: $rootScope.messages.stmsg.m0072 },
      { fieldName: 'org', type: 'empty', prompt: $rootScope.messages.stmsg.m0073 }
    ]
    var basicInfoFields = [
      { fieldName: 'firstName',
        type: 'regExp[^[0-9]*[A-Za-z\\s][0-9A-Za-z\\s]*$]',
        prompt: $rootScope.messages.stmsg.m0066
      },
      { fieldName: 'phone',
        type: 'regExp[(^(\\+91[\\-\\s]?)?[0]?(91)?[789]\\d{9}$)|([*]{6,9}[0-9]{4})]',
        prompt: $rootScope.messages.stmsg.m0067
      },
      { fieldName: 'email',
        type: 'email',
        prompt: $rootScope.messages.stmsg.m0068
      },
      { fieldName: 'language',
        type: 'empty',
        prompt: $rootScope.messages.stmsg.m0069
      }

    ]
    /**
             * @method getFields
             * @desc Get validation fields and rules for validations
             * @memberOf Services.formValidation
             * @param {string}  formName - Name attribute of form
             * @returns {Object[]} Validation fields and rules for validations
             * @instance
             */
    function getFields (formName) {
      if (formName === '#basicInfoForm') {
        return basicInfoFields
      } else if (formName === '.educationForm') {
        return educationFields
      } else if (formName === '#addressForm' || formName === '.addressForm') {
        return addressFields
      } else if (formName === '.jobProfileForm') {
        return jobProfileFields
      }
    }

    /**
             * @method validate
             * @desc Validate a form
             * @memberOf Services.formValidation
             * @param {string}  formName - Name attribute of form
             * @returns {string} Boolean true if valid form otherwise error message and false
             * @instance
             */
    this.validate = function (formName) {
      var fieldNameTypePromt = {}
      fieldNameTypePromt = getFields(formName)
      var rules = angular.copy(fieldNameTypePromt)
      var validationRules = rules.reduce(function (validation, field, index) {
        field.fieldName = {
          identifier: field.fieldName,
          optional: field.optional,
          rules: [{
            type: field.type,
            prompt: field.prompt
          }]
        }
        validation[index] = field.fieldName
        return validation
      }, {})

      $(formName).form({
        fields: validationRules,
        onSuccess: function () {
          return true
        },
        onFailure: function () {
          return false
        }
      })
      return $(formName).form('validate form')
    }
  }])
