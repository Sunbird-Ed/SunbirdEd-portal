const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const { logger } = require('@project-sunbird/logger');

const validateSlug = (allowedFolders = []) => {
    return (req, res, next) => {
        let paramsSlug = _.split(_.get(req, 'params.slug'), '__')[0];
        if (_.includes([...allowedFolders, _.get(req, 'session.rootOrg.slug')], paramsSlug)) {
            logger.info({ msg: 'validate slug passed' })
            next();
        } else {
            logger.error({ msg: 'validate slug failed', allowedFolders, sessionRootOrgDetails: _.get(req, 'session.rootOrg'), params: _.get(req, 'params') })
            const response = {
                responseCode: "FORBIDDEN",
                params: {
                    err: "FORBIDDEN",
                    status: "failed",
                    errmsg: "FORBIDDEN"
                },
                result: {}
            }
            res.status(403).send(apiResponse(response))
        }
    }
}

const validateRoles = (allowedRoles = []) => {
    return (req, res, next) => {
        const userRoles = _.get(req, 'session.roles');
        if (_.intersection(userRoles, allowedRoles).length > 0) {
            logger.info({ msg: 'validate roles passed' })
            next();
        } else {
            logger.error({ msg: 'validate roles failed', sessionRoles: _.get(req, 'session.roles'), allowedRoles })
            const response = {
                responseCode: "FORBIDDEN",
                params: {
                    err: "FORBIDDEN",
                    status: "failed",
                    errmsg: "FORBIDDEN"
                },
                result: {}
            }
            res.status(403).send(apiResponse(response))
        }
    }
}

const apiResponse = ({ responseCode, result, params: { err, errmsg, status } }) => {
    return {
        'id': 'api.report',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': status,
            'err': err,
            'errmsg': errmsg
        },
        'responseCode': responseCode,
        'result': result
    }
}

const isReportParameterized = (report) => _.get(report, 'parameters.length') > 0 && _.isArray(report.parameters);

const getHashedValue = (val) => Buffer.from(val).toString("base64");

const getParameterValue = (param, user) => {
    const parametersMapping = {
        $slug: _.get(user, 'rootOrg.slug'),
        $board: _.get(user, 'framework.board'),
        $state: _.get(_.find(_.get(user, 'userLocations'), ['type', 'state']), 'name'),
        $channel: _.get(user, 'rootOrg.hashTagId')
    };
    return parametersMapping[param];
}

const getParametersHash = (report, user) => {
    const parameters = _.get(report, 'parameters');
    const result = _.map(parameters, param => {
        const userParamValue = getParameterValue(_.toLower(param), user);
        if (!userParamValue) return null;
        if (!_.isArray(userParamValue)) return getHashedValue(userParamValue);
        return _.map(userParamValue, val => getHashedValue(val));
    });
    return _.flatMap(_.compact(result));
}

const isUserAdmin = (user) => {
    const userRoles = _.uniq(_.flatMap(_.map(user.organisations, org => org.roles)));
    return _.includes(userRoles, 'REPORT_ADMIN')
};

const isUserSuperAdmin = (user) => {
    const isAdmin = isUserAdmin(user);
    if (!isAdmin) return false;
    return _.get(user, 'rootOrg.slug') === envHelper?.sunbird_super_admin_slug;
}

const getReports = (reports, user) => {
    return _.reduce(reports, (results, report) => {
        const isParameterized = isReportParameterized(report);
        report.isParameterized = isParameterized;
        if (isParameterized) {
            const hash = getParametersHash(report, user);
            if (isUserSuperAdmin(user)) {
                results.push(report);
            } else if (isUserAdmin(user)) {
                const childReports = _.uniqBy(_.concat(_.filter(report.children, child => hash.includes(child.hashed_val)), _.map(hash, hashed_val => ({
                    hashed_val,
                    status: "draft",
                    reportid: _.get(report, 'reportid'),
                    materialize: true
                }))), 'hashed_val');
                if (childReports.length) {
                    if (childReports.length === 1) {
                        delete report.children;
                        results.push(_.assign(report, _.omit(childReports[0], 'id')));
                    } else {
                        report.children = childReports;
                        results.push(report);
                    }
                }
            } else {
                const childReports = _.filter(report.children, child => hash.includes(child.hashed_val) && child.status === 'live');
                if (childReports.length) {
                    if (childReports.length === 1) {
                        delete report.children;
                        results.push(_.assign(report, _.omit(childReports[0], 'id')));
                    } else {
                        report.children = childReports;
                        results.push(report);
                    }
                }
            }
        }
        else {
            delete report.children;
            if (!isUserAdmin(user)) {
                if (report.status === 'live') {
                    results.push(report);
                }
            } else {
                results.push(report);
            }
        }
        return results;
    }, []);
}

module.exports = {
    validateRoles,
    validateSlug,
    getReports
}
