import * as _ from 'lodash-es';
export enum Modes {
    PROCESS_DROPDOWNS = 'processDropdowns',
    PROCESS_CRITERIA = 'processCriteria'
}
export class CertConfigModel {
    public _issueTo: any;
    public _certTypes: any;
    public _criteria: any;

    constructor(data) {
        if (_.get(data, 'mode') === Modes.PROCESS_DROPDOWNS) {
            this.processDropDownValues(_.get(data, 'values'), _.get(data, 'rootOrgId'));
        } else if (_.get(data, 'mode') === Modes.PROCESS_CRITERIA) {
            this.processCriteria(_.get(data, 'values'));
        }
    }

    processDropDownValues(rawValues, rootOrgId) {
        const criteria = {};
        criteria['user'] = _.get(rawValues, 'issueTo.type') === 'All' ? {} : {  rootOrgId: rootOrgId };
        criteria['enrollment'] = _.get(rawValues, 'certificateType.value');
        this._criteria = criteria;
    }

    processCriteria(criteria) {
        this._issueTo = [];
        this._certTypes = [];
    }
}
