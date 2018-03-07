'use strict'

angular.module('playerApp')
  .service('formValidation', ['$rootScope', function ($rootScope) {
    /**
     * @class formValidation
     * @desc Service for validating forms.
     * @memberOf Services
     */

    var addressFields = [
      { fieldName: 'addressType', type: 'checked', prompt: $rootScope.messages.stmsg.m0096 },
      {
        fieldName: 'addLine1',
        optional: false,
        type: 'regExp[^[#.0-9A-Za-z\\s,]{1,50}$]',
        prompt: $rootScope.messages.stmsg.m0063
      },
      {
        fieldName: 'addLine2',
        optional: true,
        type: 'regExp[^[0-9A-Za-z\\s]{1,50}$]',
        prompt: $rootScope.messages.stmsg.m0100
      },
      { fieldName: 'city', optional: false, type: 'regExp[^[A-z]{1,35}$]', prompt: $rootScope.messages.stmsg.m0097 },
      { fieldName: 'state', optional: true, type: 'regExp[^[A-z]{1,35}$]', prompt: $rootScope.messages.stmsg.m0098 },
      { fieldName: 'country', optional: true, type: 'regExp[^[A-z]{1,35}$]', prompt: $rootScope.messages.stmsg.m0099 },
      { fieldName: 'pinCode', optional: true, type: 'regExp[^[0-9]{6}$]', prompt: $rootScope.messages.stmsg.m0065 }
    ]
    var educationFields = [
      { fieldName: 'degree', type: 'regExp[^[A-z]{1,35}$]', prompt: $rootScope.messages.stmsg.m0062 },
      { fieldName: 'institute', type: 'regExp[^[A-z]{1,100}$]', prompt: $rootScope.messages.stmsg.m0070 },
      {
        fieldName: 'yearop',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'prcntg',
        optional: true,
        type: 'regExp[^(100([\\.][0]{1,})?$|[0-9]{1,2}([\\.][0-9]{1,})?)$]',
        prompt: $rootScope.messages.stmsg.m0094
      },
      {
        fieldName: 'grade',
        optional: true,
        type: 'regExp[/^A-?|[BCD][+-]?|[AW]?F$/]',
        prompt: $rootScope.messages.stmsg.m0104
      },
      {
        fieldName: 'board',
        optional: true,
        type: 'regExp[^[A-z]{1,100}$]'
      }
    ]
    var jobProfileFields = [
      { fieldName: 'jobName', type: 'regExp[^[A-z]{2,100}$]', prompt: $rootScope.messages.stmsg.m0072 },
      { fieldName: 'org', type: 'regExp[^[A-z]{2,50}$]', prompt: $rootScope.messages.stmsg.m0073 },
      {
        fieldName: 'designation',
        optional: true,
        type: 'regExp[^[A-z]{2,50}$]',
        prompt: $rootScope.messages.stmsg.m0103
      },
      {
        fieldName: 'subjectstaught',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'radio',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'joiningDate',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'endDate',
        optional: true,
        type: 'empty'
      }
    ]
    var basicInfoFields = [
      {
        fieldName: 'firstName',
        type: 'regExp[^[0-9]*[A-Za-z\\s][0-9A-Za-z\\s]*$]',
        prompt: $rootScope.messages.stmsg.m0066
      },
      {
        fieldName: 'lastName',
        optional: true,
        type: 'regExp[^[0-9]*[A-Za-z\\s][0-9A-Za-z\\s]*$]',
        prompt: $rootScope.messages.stmsg.m0066
      },
      {
        fieldName: 'gender',
        optional: true,
        type: 'empty',
        prompt: $rootScope.messages.stmsg.m0069
      },
      {
        fieldName: 'location',
        optional: true,
        type: 'maxLength[100]',
        prompt: $rootScope.messages.stmsg.m0102
      },
      {
        fieldName: 'grades',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'phone',
        type: 'regExp[^\\d{10}$]',
        prompt: $rootScope.messages.stmsg.m0067
      },
      {
        fieldName: 'email',
        type: 'email',
        prompt: $rootScope.messages.stmsg.m0068
      },
      {
        fieldName: 'language',
        type: 'empty',
        prompt: $rootScope.messages.stmsg.m0069
      },
      {
        fieldName: 'subjects',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'birthdate',
        optional: true,
        type: 'empty'
      },
      {
        fieldName: 'fb',
        optional: true,
        type: 'url',
        prompt: $rootScope.messages.stmsg.m0101
      },
      {
        fieldName: 'twitter',
        optional: true,
        type: 'url',
        prompt: $rootScope.messages.stmsg.m0101
      },
      {
        fieldName: 'in',
        optional: true,
        type: 'url',
        prompt: $rootScope.messages.stmsg.m0101
      },
      {
        fieldName: 'blog',
        optional: true,
        type: 'url',
        prompt: $rootScope.messages.stmsg.m0101
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
    this.getFields = function (formName) {
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
    this.validate = function (formName, filedName) {
      var fieldNameTypePromt = {}
      var validationForField = []
      fieldNameTypePromt = this.getFields(formName)
      _.forEach(filedName, function (filed) {
        var validationForField1 = _.filter(fieldNameTypePromt, { 'fieldName': filed })
        validationForField.push(validationForField1[0])
      })
      var rules = angular.copy(validationForField)
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
