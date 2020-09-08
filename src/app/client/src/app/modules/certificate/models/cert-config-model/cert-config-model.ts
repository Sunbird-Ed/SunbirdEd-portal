import * as _ from 'lodash-es';
export class CertConfigModel {
    private dropDownFields = {
        COMPLETION_CERTIFICATE: 'Completion certificate',
        MY_STATE_TEACHER : 'My state teacher',
        ALL: 'All'
    };
    constructor() {
    }

    /**
     * @since - release-3.2.10
     * @param  { object } rawValues
     * @param  { string }rootOrgId
     * @description - It returns the criteria extracted from the given drop-down raw values.
     */
    processDropDownValues(rawValues, rootOrgId) {
        const criteria = {};
        if (_.get(rawValues, 'issueTo') !== this.dropDownFields.ALL) {
            criteria['user'] =  { rootOrgId: rootOrgId };
        }
        criteria['enrollment'] = _.get(rawValues, 'certificateType') === this.dropDownFields.COMPLETION_CERTIFICATE ? { status: 2 } : { };
        return criteria;
    }

    /**
     * @since - release-3.2.10
     * @param  { object } criteria
     * @description - It returns the drop-down values extracted from the given criteria.
     */
    processCriteria(criteria) {
        const dropDowns = {};
        dropDowns['issueTo'] = _.get(criteria, 'user.rootOrgId') ?
        [{ name: this.dropDownFields.MY_STATE_TEACHER }] : [{ name: this.dropDownFields.ALL }];
        dropDowns['certTypes'] = _.get(criteria, 'enrollment.status') === 2 ? [{ name: this.dropDownFields.COMPLETION_CERTIFICATE }] : [{}];
        return dropDowns;
    }

    /**
     * @since - release-3.2.10
     * @param  { object } certTypeData
     * @description - It will take preference read api response and give back the drop-downs for cert rules page
     */
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
