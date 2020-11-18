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

    prepareCreateAssetRequest(rawFormValues, channel, certificate, images) {
        const signatoryList = [{
        'image': _.get(images, 'SIGN1.url'),
        'name': _.get(rawFormValues , 'authoritySignature_0'),
        'designation' : this.splitName(_.get(rawFormValues , 'authoritySignature_0'))
        }];

        if (!_.isEmpty(images['SIGN2']) && _.get(images, 'SIGN2.name')) {
        signatoryList.push({
            'image': _.get(images , 'SIGN2.url'),
            'name': _.get(rawFormValues , 'authoritySignature_1'),
            'designation' : this.splitName(_.get(rawFormValues , 'authoritySignature_1'))
        });
        }
        let issuer = _.get(certificate, 'issuer');
        if (typeof issuer === 'string') {
            issuer = JSON.parse(issuer);
        }
        const requestBody = {
            'request': {
                'asset': {
                    'name': _.get(rawFormValues, 'certificateTitle'),
                    'code': _.get(rawFormValues, 'certificateTitle'),
                    'mimeType': 'application/vnd.ekstep.content-archive',
                    'license': 'CC BY 4.0',
                    'primaryCategory': 'Certificate Template',
                    // 'contentType': 'Asset',
                    'mediaType': 'image',
                    'certType': 'cert template',
                    'channel': channel,
                    'issuer': issuer,
                    'signatoryList': signatoryList
                }
            }
        };
        return requestBody;
    }

    splitName(name) {
        if (name) {
            const flag = name.includes(',');
            return flag ? _.trim(_.split(name, ',')[1]) : name;
        }
    }

}
