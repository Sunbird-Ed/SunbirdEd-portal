'use strict';

angular.module('playerApp')
    .service('formValidation', ['$rootScope', '$q', function ($rootScope, $q) {
        var basicProfileValidation = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.BASIC_PROFILE;
        var addressValidation = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.ADDRESS;
        var educationValidation = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.EDUCATION;
        var JobProfileValidation = $rootScope.errorMessages.PROFILE.FORM_VALIDATION.JOB_PROFILE;
        var addressFields = [
          { fieldName: 'addressType', type: 'checked', prompt: addressValidation.address_type },
          { fieldName: 'addLine1', type: 'empty', prompt: addressValidation.addLine1 },
          { fieldName: 'city', type: 'empty', prompt: addressValidation.city },
          { fieldName: 'pinCode', type: 'regExp[^[0-9]*$]', prompt: addressValidation.pin_code }
        ];
        var educationFields = [
          { fieldName: 'degree', type: 'empty', prompt: educationValidation.address_type },
          { fieldName: 'institute', type: 'empty', prompt: educationValidation.institute }
        ];
        var jobProfileFields = [
          { fieldName: 'jobName', type: 'empty', prompt: JobProfileValidation.jobName },
          { fieldName: 'org', type: 'empty', prompt: JobProfileValidation.org }
        ];
        var basicInfoFields = [
            { fieldName: 'firstName',
                type: 'regExp[^[a-zA-Z -]+$]',
                prompt: basicProfileValidation.firstName
            },
            { fieldName: 'phone',
                type: 'regExp[^(?:(?:\\+|0{0,2})91(\\s*[\\-]\\s*)?|[0]?)?[789]\\d{9}$]',
                prompt: basicProfileValidation.phone
            },
            { fieldName: 'email',
                type: 'email',
                prompt: basicProfileValidation.email
            },
            { fieldName: 'language',
                type: 'empty',
                prompt: basicProfileValidation.language },
            { fieldName: 'aadhar',
                type: 'regExp[^[0-9]*$]',
                prompt: basicProfileValidation.addhar }
        ];
        function getFields(formName) {
            if (formName === '#basicInfoForm') {
                return basicInfoFields;
            } else if (formName === '.educationForm') {
                return educationFields;
            } else if (formName === '#addressForm' || formName === '.addressForm') {
                return addressFields;
            } else if (formName === '.jobProfileForm') {
                return jobProfileFields;
            }
        }
        this.validate = function (formName) {
            var fieldNameTypePromt = {};
            fieldNameTypePromt = getFields(formName);
            var rules = angular.copy(fieldNameTypePromt);
            var validationRules = rules.reduce(function (validation, field, index) {
                field.fieldName = {
                    identifier: field.fieldName,
                    rules: [{
                        type: field.type,
                        prompt: field.prompt
                    }]
                };
                validation[index] = field.fieldName;
                return validation;
            }, {});

            $(formName).form({
                fields: validationRules,
                onSuccess: function () {
                    return true;
                },
                onFailure: function () {
                    return false;
                }
            });
            return $(formName).form('validate form');
        };
    }]);
