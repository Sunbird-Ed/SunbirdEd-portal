/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Util class for orchestrator RBAC
 *
 * @author Mahesh
 */

var promise_lib = require('when');
var mongoose = require('mongoose');
var errorModule = require('../view_helpers/ErrorModule');

var roles = {};

exports.setRoles = function(approles) {
    roles = approles;
}

exports.getRoles = function() {
    return roles;
}

exports.initializeRoles = function(connectroles, callback) {
    promise_lib.resolve()
    .then(function(){return exports.getAllRoles(); })
    .then(function(roles) {
        var approles = {};
        roles.forEach(function(role) {
            approles[ role.identifier ] = role.actions;
         });
         exports.setRoles(approles);
         console.log("Roles cacheing completed.");
    })
    .catch(function(err) {
        console.log("Error cacheing roles: "+err);
    })
    .done(function() {
        exports.authoriseAction(connectroles);
        callback(connectroles);
    });
}

/**
 * To get all roles.
 * @return promise.
 */

exports.getAllRoles = function() {
    var defer = promise_lib.defer();
    RoleModel = mongoose.model('RoleModel');
    RoleModel.find().lean().exec(function(err, roles) {
        console.log("Total number of roles: " + roles.length);
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(roles);
        }
    });
    return defer.promise;
}

/**
 * This is the filter to authorise every private request.
 * @return null or boolean value.
 */

exports.authoriseAction = function(connectroles, approles) {
    connectroles.use(function(req, action) {
        /*console.log("roles:"+JSON.stringify(roles));*/
        var result = false;
        if (req.roles && req.roles.length > 0) {
            for (i = 0; i < req.roles.length; i++) {
                var actions = roles[req.roles[i]];
                if (actions && actions.indexOf(action) > -1) {
                    result = true;
                    break;
                }
            }
        }
        if (result) return true;

    });
    console.log("Registered roles with actions to authorize users. The roles and actions are: " + JSON.stringify(roles));
}