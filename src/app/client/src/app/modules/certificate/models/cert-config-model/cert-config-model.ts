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
        criteria['enrollment'] =  { status: 2 };
        if (_.get(rawValues, 'scoreRange')) {
            const scoreRange = (_.get(rawValues, 'scoreRange')).substr(0,(_.get(rawValues, 'scoreRange')).indexOf('%'));
            criteria['assessment'] = { score:{'>=': parseInt(scoreRange)}};
        }
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
        dropDowns ['scoreRange'] = _.get(criteria,'assessment.score')?criteria.assessment.score['>=']+'%':'';
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
        const sign_1 = this.splitName(_.get(images, 'SIGN1.url'), rawFormValues, 'authoritySignature_0');
        const signatoryList = [];
        signatoryList.push(sign_1);

        if (!_.isEmpty(images['SIGN2']) && _.get(images, 'SIGN2.name')) {
            const sign_2 = this.splitName(_.get(images, 'SIGN2.url'), rawFormValues, 'authoritySignature_1');
            signatoryList.push(sign_2);
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

    splitName(imageUrl, sign, key) {
        const name = _.get(sign , key);
        const signValues = name.split(',');
        const designation = signValues[1] || 'CEO';
        const signatoryList = {
            name: name,
            image: imageUrl,
            designation: designation,
            id: `${designation}/CEO`
        };
        return signatoryList;
    }

}
