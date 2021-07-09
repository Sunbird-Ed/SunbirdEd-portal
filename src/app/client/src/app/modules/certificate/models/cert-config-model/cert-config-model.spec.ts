import { CertConfigModel } from './cert-config-model';
import { response } from '../../components/certificate-configuration/certificate-configuration.component.spec.data';

describe('CertConfigModel', () => {
  it('should create an instance', () => {
    expect(new CertConfigModel()).toBeTruthy();
  });

  describe('when user rootOrgId present / not present', () => {
    const classInstance = new CertConfigModel();

    it('should return "issueTo" for MY_STATE_TEACHER if there exist rootOrgId in the criteria ', () => {
      expect(classInstance.processCriteria({ user: { rootOrgId: 'SOME_ROOT_ORG_ID' } }))
      .toEqual(jasmine.objectContaining({
        issueTo: [
          {
            name: 'My state teacher'
          }
        ]
      }));
    });

    it('should return "issueTo" for ALL if there exists no rootOrgId in the criteria', () => {
      expect(classInstance.processCriteria({ user: {  } }))
      .toEqual(jasmine.objectContaining({
        issueTo: [
          {
            name: 'All'
          }
        ]
      }));
    });

  });

  describe('when enrollment status is complete / incomplete', () => {
    const classInstance = new CertConfigModel();

    it('should return "certTypes" for COMPLETION_CERTIFICATE if enrolment status is 2', () => {
      expect(classInstance.processCriteria({ enrollment: { status: 2 } }))
      .toEqual(jasmine.objectContaining({
        certTypes: [
          {
            name: 'Completion certificate'
          }
        ]
      }));
    });

    it('should return empty "certTypes"  if enrolment status is other than 2 ', () => {
      expect(classInstance.processCriteria({
        enrollment: {
          status: 0
        }
      })).toEqual(jasmine.objectContaining({
        certTypes: [{}]
      }));
    });
  });

  describe('when drop-down is selected for "issue to" field', () => {
    const classInstance = new CertConfigModel();

    it('should return "user" object with  rootOrgId if recipient is selected as "My state teacher"', () => {
      expect(classInstance.processDropDownValues({ issueTo: 'My state teacher' }, 'SOME_ROOT_ORG_ID'))
      .toEqual(jasmine.objectContaining({
        user: {
          rootOrgId: 'SOME_ROOT_ORG_ID'
        }
      }));
    });
  });

  xdescribe('when drop-down is selected for "certificate type" field', () => {
    const classInstance = new CertConfigModel();
    it('should return "enrolment" object with  "status" if certificate type is  selected as "Completion certificate"', () => {
      expect(classInstance.processDropDownValues({ certificateType: 'Completion certificate' }, 'SOME_ROOT_ORG_ID'))
      .toEqual(jasmine.objectContaining({
        enrollment: {
          status: 2
        }
      }));
    });

    it('should return "enrolment" as empty object if certificate type is  selected other than "Completion certificate"', () => {
      expect(classInstance.processDropDownValues({ certificateType: 'Merit certificate' }, 'SOME_ROOT_ORG_ID'))
      .toEqual(jasmine.objectContaining({
        enrollment: {       }
      }));
    });
  });

  describe(' getting the drop down values for "certificate type" and "issue to" field', () => {
    const classInstance = new CertConfigModel();
    it('should return the drop-down values for certificate type', () => {
      const mockApiResponse = response.mockData.data;
      expect(classInstance.getDropDownValues(mockApiResponse)).toEqual(jasmine.objectContaining({
        certTypes: [
          {
            'type': 'Completion certificate',
            'status': 2
          }
        ]
      }));
    });

    it('should return the drop-down values for "issue to" ', () => {
      const mockApiResponse = response.mockData.data;
      expect(classInstance.getDropDownValues(mockApiResponse)).toEqual(jasmine.objectContaining({
        issueTo: [
          {
            'type': 'All',
            'rootOrgId': ''
          },
          {
            'type': 'My state teacher',
            'rootOrgId': ''
          }
        ]
      }));
    });
  });
});


