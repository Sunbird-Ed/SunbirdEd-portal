import { map } from 'rxjs/operators';
import { Injectable,EventEmitter } from '@angular/core';
import { LearnerService } from '@sunbird/core';
import { ConfigService,ServerResponse } from '@sunbird/shared';
import { Observable,BehaviorSubject, of } from 'rxjs';
import { IorgTypeData } from './../../interfaces';
import { OrgTypeService } from './org-type.service';

describe('OrgTypeService', () => {
    let orgTypeService: OrgTypeService;

    const mockLearner :Partial<LearnerService> ={
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
    };
	const mockConfig :Partial<ConfigService> ={
        urlConFig: {
            URLS: {
              ORG_TYPE: {
                GET: 'http://mock-org.com/orgtypes',
                ADD: 'http://mock-org.com/addtypes',
                UPDATE: 'http://mock-org.com/updatetypes',
              }
            }
        }    
    };

    beforeAll(() => {
        orgTypeService = new OrgTypeService(
            mockLearner as LearnerService,
			mockConfig as ConfigService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of service', () => {
        expect(orgTypeService).toBeTruthy();
    });

    describe('getOrgTypes', () => {
        it('should call learnerService.get with correct URL', () => {
          const expectedUrl = 'http://mock-org.com/orgtypes';
          jest.spyOn(orgTypeService.learner,'get').mockReturnValue(new Observable());
          orgTypeService.getOrgTypes();
    
          expect(mockLearner.get).toHaveBeenCalledWith({ url: expectedUrl });
        });

        it('should update orgTypeData$ BehaviorSubject with data on successful response', () => {
            const responseData = 'mock-response' as any;
            jest.spyOn(orgTypeService.learner,'get').mockReturnValue(new Observable(observer => {
              observer.next(responseData);
              observer.complete();
            }));
            orgTypeService.getOrgTypes();
    
            orgTypeService.orgTypeData$.subscribe(data => {
              expect(data).toEqual({ orgTypeData: responseData, err: null  });
            });
        });

        it('should update orgTypeData$ BehaviorSubject with error on failure response', () => {
            const errorResponse = 'mock-error-response' as any;
            jest.spyOn(orgTypeService.learner,'get').mockReturnValue(new Observable(observer => {
              observer.error(errorResponse);
            }));
            orgTypeService.getOrgTypes();
    
            orgTypeService.orgTypeData$.subscribe(data => {
              expect(data).toEqual({ orgTypeData: null, err: errorResponse });
            });
        });
    });
    
    describe('addOrgType', () => {
        it('should call learnerService.post with correct URL and data', () => {
          const orgName = 'mock-org';
          const expectedUrl = 'http://mock-org.com/addtypes';
          const responseData = 'mock-response' as any;
          jest.spyOn(orgTypeService.learner,'post').mockReturnValue(of(responseData));
          orgTypeService.addOrgType(orgName).subscribe();
    
          expect(mockLearner.post).toHaveBeenCalledWith({
             url: expectedUrl,
               data: {
                  request: {
                     name: orgName
                  }
                }
           });
        });

        it('should call getOrgTypes after successful addition', () => {
            const orgName = 'mock-org';
            const responseData =  'mock-response' as any;
            jest.spyOn(orgTypeService.learner,'post').mockReturnValue(of(responseData));
            const getOrgTypesSpy = jest.spyOn(orgTypeService, 'getOrgTypes');
            orgTypeService.addOrgType(orgName).subscribe();
      
            expect(getOrgTypesSpy).toHaveBeenCalled();
        });
        
        it('should return data from learnerService.post', (done) => {
            const orgName = 'mock-org';
            const responseData = 'mock-response' as any;
            jest.spyOn(orgTypeService.learner,'post').mockReturnValue(of(responseData));
    
            orgTypeService.addOrgType(orgName).subscribe((data) => {
              expect(data).toEqual(responseData);
              done();
            });
        });
    });

    describe('updateOrgType', () => {
        it('should call learnerService.patch with correct URL and data', () => {
          const orgDetails = 'mock-org-details';
          const expectedUrl = 'http://mock-org.com/updatetypes';
          const responseData = 'mock-response' as any;
          jest.spyOn(orgTypeService.learner,'patch').mockReturnValue(of(responseData));
          orgTypeService.updateOrgType(orgDetails).subscribe();
    
          expect(mockLearner.patch).toHaveBeenCalledWith({
            url: expectedUrl,
            data: {
              request: orgDetails
            }
          });
        });

        it('should emit orgTypeUpdateEvent with orgDetails after successful update', () => {
            const orgDetails = 'mock-org-details';
            const responseData = 'mock-response' as any;
            jest.spyOn(orgTypeService.learner,'patch').mockReturnValue(of(responseData));
            const emitSpy = jest.spyOn(orgTypeService.orgTypeUpdateEvent, 'emit');
            orgTypeService.updateOrgType(orgDetails).subscribe();
      
            expect(emitSpy).toHaveBeenCalledWith(orgDetails);
        });

        it('should return data from learnerService.patch', (done) => {
            const orgDetails = 'mock-org-details';
            const responseData = 'mock-response' as any;
            jest.spyOn(orgTypeService.learner,'patch').mockReturnValue(of(responseData));
            
            orgTypeService.updateOrgType(orgDetails).subscribe((data) => {
              expect(data).toEqual(responseData);
              done();
            });
        });
    });    

});
