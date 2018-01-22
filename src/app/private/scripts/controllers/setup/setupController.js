'use strict'

angular.module('playerApp')
  .controller('setupController', [
    '$rootScope',
    'setupService',
    'toasterService',

    function ($rootScope, setupService, toasterService) {
      var setup = this
      setup.getOrgTypes = function () {
        setup.loader = toasterService.loader('', 'loading please wait')
        setupService.getOrgTypes().then(function (res) {
          setup.loader.showLoader = false
          try {
            if (res.responseCode === 'OK') {
              var orgTypes = angular.copy(res.result.response)
              setup.orgTypes = _.sortBy(orgTypes, function (i) { return i.name.toLowerCase() })
            } else if (res.responseCode === 'CLIENT_ERROR') {
              throw new Error(res.params.errmsg)
            } else throw new Error('')
          } catch (err) {
            if (err.message) {
              toasterService.error(err.message)
            } else {
              toasterService.error($rootScope.messages.fmsg.m0059)
            }
          }
        })
      }
      setup.openUpdateModal = function (orgType) {
        $('#updateOrgType').modal({
          onShow: function () {
            setup.selectedOrg = {}
            setup.selectedOrg.orgType = orgType
            setup.isUpdated = false
          },
          onHide: function () {
            setup.selectedOrg = {}
            setup.isUpdated = false
            return true
          }
        }).modal('show')
        $('#updateOrgType').modal('refresh')
      }
      setup.openAddTypeModal = function () {
        $('#addOrgType').modal({
          onShow: function () {
            setup.newOrgType = ''
          },
          onHide: function () {
            setup.newOrgType = ''
            return true
          }
        }).modal('show')
        $('#addOrgType').modal('refresh')
      }

      setup.addOrgType = function (orgType) {
        var req = {
          request: {
            name: orgType
          }
        }

        setupService.addOrgType(req).then(function (res) {
          try {
            if (res.responseCode === 'OK') {
              toasterService.success($rootScope.messages.smsg.m0035)
              setup.getOrgTypes()
            } else if (res.responseCode === 'CLIENT_ERROR') {
              throw new Error(res.params.errmsg)
            } else throw new Error('')
          } catch (err) {
            if (err.message) {
              toasterService.error(err.message)
            } else {
              toasterService.error($rootScope.messages.fmsg.m0058)
            }
          }
        })
      }

      setup.updateOrgType = function (orgType) {
        var req = {
          request: orgType
        }
        setupService.updateOrgType(req).then(function (res) {
          try {
            if (res.responseCode === 'OK') {
              toasterService.success(orgType.name + ' ' + $rootScope.messages.smsg.m0037)
              setup.getOrgTypes()
            } else if (res.responseCode === 'CLIENT_ERROR') {
              throw new Error(res.params.errmsg)
            } else throw new Error('')
          } catch (err) {
            if (err.message) {
              toasterService.error(err.message)
            } else {
              toasterService.error($rootScope.messages.fmsg.m0060)
            }
          }
        })
      }
      setup.getOrgTypes()
    }
  ])
