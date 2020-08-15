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
        criteria['user'] = _.get(rawValues, 'issueTo.type') === this.dropDownFields.ALL ? {} : { rootOrgId: rootOrgId };
        criteria['enrollment'] = _.get(rawValues, 'certificateType.value');
        return criteria;
    }

    processCriteria(criteria) {
        const dropDowns = {};
        dropDowns['issueTo'] = _.get(criteria, 'user.rootOrgId') ?
        [{ type: this.dropDownFields.MY_STATE_TEACHER }] : [{ type: this.dropDownFields.ALL }];
        dropDowns['certTypes'] = _.get(criteria, 'enrollment.status') === 2 ? [{ type: this.dropDownFields.COMPLETION_CERTIFICATE }] : [{}];
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
