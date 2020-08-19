import * as _ from 'lodash-es';

export class CertConfigModel {
    private dropDownFields = {
        COMPLETION_CERTIFICATE: 'Completion certificate',
        MY_STATE_TEACHER : 'My state teacher',
        ALL: 'All'
    };
    constructor() {
    }

    processDropDownValues(rawValues, rootOrgId) {
        const criteria = {};
        criteria['user'] = _.get(rawValues, 'issueTo') === this.dropDownFields.ALL ? {rootOrgId: ''} : { rootOrgId: rootOrgId };
        criteria['enrollment'] = _.get(rawValues, 'certificateType') === this.dropDownFields.COMPLETION_CERTIFICATE ? { status: 2 } : { };
        return criteria;
    }

    processCriteria(criteria) {
        const dropDowns = {};
        dropDowns['issueTo'] = _.get(criteria, 'user.rootOrgId') ?
        [{ name: this.dropDownFields.MY_STATE_TEACHER }] : [{ name: this.dropDownFields.ALL }];
        dropDowns['certTypes'] = _.get(criteria, 'enrollment.status') === 2 ? [{ name: this.dropDownFields.COMPLETION_CERTIFICATE }] : [{}];
        return dropDowns;
    }

    getDropDownValues(certTypeData) {
        const processedDropdownValues = {};
        const certTypes = certTypeData.filter(val => {
            return val.code === 'certTypes';
        });
        processedDropdownValues['certTypes'] = _.get(certTypes[0], 'range');

        const issueTo = certTypeData.filter(data => {
            return data.code === 'issueTo';
        });
        processedDropdownValues['issueTo'] = _.get(issueTo[0], 'range');

        return processedDropdownValues;

    }
}
