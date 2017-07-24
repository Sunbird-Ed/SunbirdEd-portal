const request = require('request'),
    _ = require('lodash'),
    dateFormat = require('dateformat'),
    uuidv1 = require('uuid/v1'),
    learnerURL = process.env.sunbird_learner_player_url || 'http://52.172.36.121:9000/v1/';



let PERMISSIONS_HELPER = {
    ROLES_URLS: {
        "course/create": ["CONTENT_CREATOR", "CONTENT_CREATION", "CONTENT_REVIEWER"],
        "course/update": ["CONTENT_CREATOR", "CONTENT_CREATION", "CONTENT_REVIEWER"],
        "course/review": ["CONTENT_CREATOR", "CONTENT_CREATION", "CONTENT_REVIEWER", "CONTENT_REVIEW"],
        "course/publish": ["CONTENT_REVIEWER", "CONTENT_REVIEW"],
        "content/retire": ["CONTENT_REVIEWER", "CONTENT_REVIEW"],
        "content/reject": ["CONTENT_REVIEWER", "CONTENT_REVIEW"],
        "content/create": ["CONTENT_CREATOR", "CONTENT_CREATION", "CONTENT_REVIEWER"],
        "content/update": ["CONTENT_CREATOR", "CONTENT_CREATION", "CONTENT_REVIEWER"],
        "content/review": ["CONTENT_CREATOR", "CONTENT_CREATION", "CONTENT_REVIEWER", "CONTENT_REVIEW"],
        "content/publish": ["CONTENT_REVIEWER", "CONTENT_REVIEW"],
        "organisation/update": ["ADMIN", "ORG_MANAGEMENT"],
        "user/create": ["ADMIN",
            "ORG_MANAGEMENT",
            "ORG_ADMIN",
            "MEMBERSHIP_MANAGEMENT",
            "ORG_MODERATOR"
        ]
    },

    getPermissions: function() {
        var options = {
            method: 'GET',
            url: learnerURL + 'role/read',
            headers: {
                'x-device-id': 'middleware',
                'x-msgid': uuidv1(),
                ts: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                'x-consumer-id': '7c03ca2e78326957afbb098044a3f60783388d5cc731a37821a20d95ad497ca8',
                'content-type': 'application/json',
                accept: 'application/json'
            }
        };

        request(options, function(error, response, body) {
            if (!error && body) {
                body = JSON.parse(body);
                if (body.responseCode === "OK") {
                    module.exports.setRoleUrls(body.result);
                }
            }

        });
    },
    setRoleUrls: function(roleData) {
        var roles = _.cloneDeep(roleData.roles);
        _.forEach(roles, function(role) {
            var roles = [role.id];
            _.forEach(role.actionGroups, function(actionGroup) {
                roles.push(actionGroup.id);
                _.forEach(actionGroup.actions, function(action) {
                    _.forEach(action.urls, function(url) {
                        module.exports.ROLES_URLS[url] = module.exports.ROLES_URLS[url] || [];
                        module.exports.ROLES_URLS[url] = _.union(module.exports.ROLES_URLS[url], roles)
                    })
                })
            })
        })
    },

    getCurrentUserRoles: function(reqObj, callback) {
        var userId = reqObj.kauth.grant.access_token.content.sub;
        var options = {
            method: 'GET',
            url: learnerURL + 'user/getprofile/' + userId,
            headers: {
                'x-authenticated-userid': userId,
                'x-device-id': 'middleware',
                'x-msgid': uuidv1(),
                ts: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                'x-consumer-id': 'X-Consumer-ID',
                'content-type': 'application/json',
                accept: 'application/json'
            }
        };

        request(options, function(error, response, body) {
            reqObj.session.roles = [];
            reqObj.session.orgs = [];
            if (!error && body) {
                body = JSON.parse(body)
                if (body.responseCode === "OK") {
                    reqObj.session.roles = body.result.response.roles;
                    if (body.result.response.organisations) {
                        _.forEach(body.result.response.organisations, function (org) {
                            if (org.roles && _.isArray(org.roles)) {
                                reqObj.session.roles = _.union(reqObj.session.roles, org.roles)   
                            }
                            if (org.organisationId) {
                                reqObj.session.orgs.push(org.organisationId);
                            }
                        })
                    }
                    if (body.result.response.rootOrg && body.result.response.rootOrg.id) {
                        reqObj.session.rootOrgId = body.result.response.rootOrg.id;
                    }
                }
            }
            reqObj.session.save();
            callback(error, body);
        });

    },
    checkPermission: function(url) {
        return function(req, res, next) {           
            var roles = module.exports.checkURLMatch(req.originalUrl);
            if (_.isArray(roles)) {
               if (_.intersection(roles, req.session['roles']).length > 0) {
                    next();
                } else {
                    res.status(401);
                    res.send({
                        "id": "api.error",
                        "ver": "1.0",
                        "ts": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                        "params": {
                            "resmsgid": uuidv1(),
                            "msgid": null,
                            "status": "failed",
                            "err": "UNAUTHORIZED_ERROR",
                            "errmsg": "Unauthorized: Access is denied"
                        },
                        "responseCode": "UNAUTHORIZED",
                        "result": {}
                    });
                    res.end();
                }
            } else {
                next()
            }
        }
    },
    checkURLMatch: function(url) {
        var roles = [];
        _.forEach(module.exports.ROLES_URLS, function(value, key) {
            if (url.indexOf(key) > -1) {
                roles = value;
                return false;
            }
        })
        if (roles.length) {
            return roles;
        }
        return false;
    }
};
module.exports = PERMISSIONS_HELPER;
