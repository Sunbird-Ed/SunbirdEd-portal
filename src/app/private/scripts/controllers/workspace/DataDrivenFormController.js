'use strict'

angular.module('playerApp')
  .controller('DataDrivenFormController', ['contentService', '$timeout', '$state', 'config',
    '$rootScope', '$scope', 'toasterService', 'searchService', 'configService', 'telemetryService',
    function (contentService, $timeout, $state, config, $rootScope, $scope, toasterService,
      searchService, configService, telemetryService) {
      var dataDrivenForm = this
      dataDrivenForm.categoryModelList = {}
      dataDrivenForm.formDropdown = configService.getWorkspaceFormDropdown()
      dataDrivenForm.years = dataDrivenForm.formDropdown.years
      dataDrivenForm.resourceType = dataDrivenForm.formDropdown.resourceType
      dataDrivenForm.StdMtrformDropdown = configService.getWorkspaceStdMtrlDrpdown()
      dataDrivenForm.resourceType = dataDrivenForm.StdMtrformDropdown.resourceType
      dataDrivenForm.categoryList = {}
      dataDrivenForm.dropdownId = []
      dataDrivenForm.dropdownValue = []
      dataDrivenForm.selectedContent = ''
      $scope.validation = {}
      dataDrivenForm.isSubmit = false

      /**
   * 
   * @description                     -
   * @param {Object} configurations   - Field configurations
   * @param {String} key              - Field uniq code
   */
      dataDrivenForm.mapMasterCategoryList = function (configurations, key) {
        _.forEach(configurations, function (field, value) {
          if (key) {
            if (field.code === key) {
              dataDrivenForm.categoryList[field.code] = field.range
            }
          } else {
            field.range && (dataDrivenForm.categoryList[field.code] = field.range)
          }
        })
      }
      dataDrivenForm.dispatchEvent = function (event, data) {
        // console.log("data",data)
        org.sunbird.portal.eventManager.dispatchEvent(event, data)
      }

      /**
 * @description     - It Initialize the dropdown with selected values
 */
      dataDrivenForm.initDropdown = function () {

      }

      /**
       *@description            - Which is used to update the form when vlaues is get changes
       * @param {String} event  - Name of the event.
       * @param {Object} object - Field information
       */
      dataDrivenForm.onConfigChange = function (event, object) {
        dataDrivenForm.isSubmit = false
        // console.log("object",object)
        dataDrivenForm.updateForm(object)
      }

      /**
  * @description            - Which is used to update the form when vlaues is get changes
  * @param {Object} object  - Field information
  */
      dataDrivenForm.updateForm = function (object) {
        if (object.field.range) {
          dataDrivenForm.getAssociations(object.value, object.field.range, function (associations) {
            dataDrivenForm.applayDependencyRules(object.field, associations, true)
          })
        }
      }

      /** 
     * @description                    - Which is used to get the association object by mapping key and range object
     * @param {String | Array} keys    - To the associactio object for particular key's
     * @param {Object} range           - Which refers to framework terms/range object
     */
      dataDrivenForm.getAssociations = function (keys, range, callback) {
        var associations = []
        var values = _.filter(range, function (res) { return _.includes(keys, res.name) })
        _.forEach(values, function (key, value) {
          if (key.associations) {
            _.forEach(key.associations, function (key, value) {
              associations.push(key)
            })
          }
        })
        callback && callback(associations)
      }

      /**
     * @description                    - Which is used to resolve the dependency. 
     * @param {Object} field           - Which field need need to get change.
     * @param {Object} associations    - Association values of the respective field.
     * @param {Boolean} resetSelected  - @default true Which defines while resolving the dependency dropdown
     *                                   Should reset the selected values of the field or not
     */
      dataDrivenForm.applayDependencyRules = function (field, associations, resetSelected) {
        // reset the depended field first
        // Update the depended field with associated value
        // Currently, supported only for the dropdown values
        var dependedValues
        if (field.depends && field.depends.length) {
          _.forEach(field.depends, function (id) {
            resetSelected && dataDrivenForm.resetSelectedField(id)
            dependedValues = _.map(associations, function (i) { return _.pick(i, 'name') })
            dataDrivenForm.updateDropDownList(id, dependedValues)
          })
        }
      }

      /**
     * @description            - Which updates the drop down value list 
     *                         - If the specified values are empty then drop down will get update with master list
     * @param {Object} field   - Field which is need to update.
     * @param {Object} values  - Values for the field
     */
      dataDrivenForm.updateDropDownList = function (fieldCode, values) {
        if (values.length) {
          dataDrivenForm.categoryList[fieldCode] = values
        } else {
          dataDrivenForm.mapMasterCategoryList(dataDrivenForm.formFieldProperties, fieldCode)
        }
      }

      /** 
     * @description         - Which is used to restore the dropdown slected value.
     * @param {String} id   - To restore the specific dropdown field value 
     */
      dataDrivenForm.resetSelectedField = function (id) {
        setTimeout(function () {
          $('#' + id).dropdown('restore defaults')
          $('#' + id).dropdown('refresh')
          dataDrivenForm.data[id] = undefined
        }, 0)
      }

      dataDrivenForm.saveMetaData = function (data, dataDrivenFormData) {
        dataDrivenForm.isSubmit = true
        if (data === undefined || data === null || data === '') {
          data = {}
        }
        !$scope.metaForm.$valid && dataDrivenForm.updateErrorMessage($scope.metaForm)

        if ($scope.metaForm.$valid) {
          switch ($state.current.name) {
          case 'CreateTextbook':
            $rootScope.$broadcast('CreateTextbook', { Data: data, framework: dataDrivenForm.framework })
            break
          case 'CreateCourse':
            $rootScope.$broadcast('CreateCourse', { Data: data, framework: dataDrivenForm.framework })
            break
          case 'CreateCollection':
            $rootScope.$broadcast('CreateCollection', { Data: data, framework: dataDrivenForm.framework })
            break
          case 'CreateLesson':
            $rootScope.$broadcast('CreateLesson', { Data: data, framework: dataDrivenForm.framework })
            break
          case 'CreateLessonPlan':
            $rootScope.$broadcast('CreateLessonPlan', { Data: data, framework: dataDrivenForm.framework })
            break
          }
        }
        // console.log("data", data)
      }

      dataDrivenForm.updateErrorMessage = function () {
        if ($scope.metaForm.$valid) return
        _.forEach(dataDrivenForm.formFieldProperties, function (value, key) {
          if ($scope.metaForm[value.code] && $scope.metaForm[value.code].$invalid) {
            $scope.validation[value.code] = {}
            switch (_.keys($scope.metaForm[value.code].$error)[0]) {
            case 'pattern': // When input validation of type is regex
              $scope.validation[value.code]['errorMessage'] = value.validation.regex.message
              break
            case 'required': // When input validation of type is required
              $scope.validation[value.code]['errorMessage'] = 'Plese Input a value'
              break
            case 'maxlength': // When input validation of type is max
              $scope.validation[value.code]['errorMessage'] = value.validation.max.message
              break
            default:
              $scope.validation[value.code]['errorMessage'] = 'Invalid Input'
            }
          }
        })
      }

      /**
       * @description                      - Which is used to configure the symantic ui drop down
       *                                     to enable/disable the force selection field and multiSelect fields with tags format 
       *
       * @param {Boolean} labels           - @default false Which defines the MultiSelect should be tag format design or not
       * @param {Boolean} forceSelection   - @default false Which defines the force selection should enalbe or not
       */
      dataDrivenForm.configureDropdowns = function (labels = false, forceSelection = false) {
        // TODO: Need to remove the timeout
        setTimeout(function () {
          $('.ui.dropdown').dropdown({
            useLabels: labels,
            forceSelection: forceSelection
          })
        }, 0)
      }

      /** 
       * @description - Initialization of the controller
       *              - Which partions the fixedLayout and dynamic layout section fields
       */
      dataDrivenForm.init = function () {
        dataDrivenForm.loader = toasterService.loader('', $rootScope.messages.stmsg.m0014)
        org.sunbird.portal.eventManager.addEventListener('editor:form:change', dataDrivenForm.onConfigChange,
          dataDrivenForm.formFieldProperties)
        switch ($state.current.name) {
        case 'CreateTextbook':
          dataDrivenForm.selectedContent = 'textBookFormConfigurations'
          break
        case 'CreateCourse':
          dataDrivenForm.selectedContent = 'courseFormConfigurations'
          break
        case 'CreateCollection':
          dataDrivenForm.selectedContent = 'collectionFormConfigurations'
          break
        case 'CreateLesson':
          dataDrivenForm.selectedContent = 'lessonFormConfigurations'
          break
        case 'CreateLessonPlan':
          dataDrivenForm.selectedContent = 'lessonPlanFormConfigurations'
          break
        }
        var selectedForm = config.FILTER.RESOURCES[dataDrivenForm.selectedContent]
        dataDrivenForm.Template = selectedForm.templateName
        // console.log("dataDrivenForm.Template",dataDrivenForm.Template)
        dataDrivenForm.formFieldProperties = selectedForm.fields
        // console.log("dataDrivenForm.formFieldProperties",dataDrivenForm.formFieldProperties)
        // console.log("dataDrivenForm.years",dataDrivenForm.years)
        dataDrivenForm.formFieldProperties.sort(function (a, b) {
          return a.index - b.index
        })
        // _.forEach(dataDrivenForm.formFieldProperties, function (category) {
        //   console.log("category.range", category.range)
        //   if (category.inputType === 'Term' || category.inputType === 'Select' || category.inputType === 'Year')
        //     dataDrivenForm.dropdownId.push(category)
        // })
        // setTimeout(function() {
        //   _.forEach(dataDrivenForm.dropdownId, function (dropdown) {
        //     var id = '#' + dropdown.code
        //     $(id).dropdown();
        //   })
        // }, 0)

        searchService.getChannel().then(function (res) {
          if (res.responseCode === 'OK') {
            dataDrivenForm.version = res.ver
            dataDrivenForm.framework = null
            dataDrivenForm.framework = _.find(res.result.channel.suggested_frameworks, function (framework) {
              return framework.identifier === res.result.channel.defaultFramework
            }).identifier
            // console.log("dataDrivenForm.framework", dataDrivenForm.framework)
            searchService.getFramework(dataDrivenForm.framework).then(function (res) {
              if (res.responseCode === 'OK') {
                dataDrivenForm.frameworkData = res.result.framework.categories
                var categoryMasterList = _.cloneDeep(res.result.framework.categories)
                _.forEach(categoryMasterList, function (category) {
                  _.forEach(dataDrivenForm.formFieldProperties, function (formFieldCategory) {
                    if (formFieldCategory.code === 'year') {
                      formFieldCategory.range = dataDrivenForm.years
                    }
                    if (formFieldCategory.validation) {
                      _.forEach(formFieldCategory.validation, function (value, key) {
                        if (value.type === 'regex') {
                          value.value = new RegExp(value.value)
                        }
                        formFieldCategory.validation[value.type] = value
                      })
                    }
                    if (category.code === formFieldCategory.code) {
                      formFieldCategory.range = category.terms
                    }
                    return formFieldCategory
                  })
                })
                dataDrivenForm.loader.showLoader = false
                // console.log("dataDrivenForm.formFieldProperties", dataDrivenForm.formFieldProperties)
                const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect']
                $timeout(function () {
                  _.forEach(dataDrivenForm.formFieldProperties, function (field) {
                    if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
                      $('#' + field.code).dropdown('set selected', dataDrivenForm.frameworkData[field.code])
                      if (field.depends && field.depends.length) {
                        dataDrivenForm.getAssociations(dataDrivenForm.frameworkData[field.code],
                          field.range, function (associations) {
                            dataDrivenForm.applayDependencyRules(field, associations, false)
                          })
                      }
                    }
                  })
                  dataDrivenForm.configureDropdowns(dataDrivenForm.formFieldProperties)
                }, 0)
                dataDrivenForm.mapMasterCategoryList(dataDrivenForm.formFieldProperties)
              }
            }).catch(function (error) {
              console.log('error is ......', error)
            })
          }
        }).catch(function (error) {
          console.log('error is ......', error)
        })
      }

      dataDrivenForm.refreshModel = function () {
        $timeout(function () {
          $('#createTextBookModal').modal('refresh')
          $('#createCourseModal').modal('refresh')
          $('#createSlideShowModal').modal('refresh')
          $('#createCollectionModel').modal('refresh')
          $('#createLessonPlanModal').modal('refresh')
        }, 0)
      }
    }
  ])
