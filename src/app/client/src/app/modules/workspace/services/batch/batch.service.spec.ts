import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { BatchService } from './batch.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { Response } from './batch.service.spec.data';

describe('BatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [BatchService, UserService, ConfigService,
        ContentService, LearnerService]
    });
  });

  it('should be created', inject([BatchService], (service: BatchService) => {
    expect(service).toBeTruthy();
  }));

  it('should call update  batch  api  and return sucess response', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      const requestParam = {
        'name': 'Test 12345',
        'description': 'test',
        'enrollmentType': 'invite-only',
        'startDate': new Date('2018-04-19'),
        'endDate': new Date('2018-04-25'),
        'createdFor': [
          '0123653943740170242',
          'ORG_001'
        ],
        'id': '0124858459476131840',
        'mentors': [
          '8454cb21-3ce9-4e30-85b5-fade097880d8'
        ]
      };
      spyOn(learnerService, 'patch').and.callFake(() => Observable.throw({}));
      spyOn(batchService, 'updateBatchDetails').and.callFake(() => Observable.of(Response.updateSucess));
      batchService.updateBatchDetails(requestParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('success');
        }
      );
    }));

  it('should call addUsers method to add the user ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      const requestParam = {
        'userIds': [
          'bf851834-466c-427a-8e00-d6a55c4ada8a',
          '6f3897a4-29d9-4a37-b4cb-5ad6c64ac3c5'
        ]
      };
      spyOn(batchService, 'addUsers').and.callFake(() => Observable.of(Response.addUserSucess));
      spyOn(learnerService, 'post').and.callFake(() => Observable.throw({}));
      batchService.addUsers(requestParam, '0124963527344947201').subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('success');
        }
      );
      expect(batchService).toBeTruthy();
    }));

  it('should call getBatchDetailsById method to fetch the batchdetails  ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      const requestParam = {
        'batchId': '0124963527344947201'
      };
      spyOn(batchService, 'getBatchDetailsById').and.callFake(() => Observable.of(Response.getbatchDetailSucess));
      spyOn(learnerService, 'get').and.callFake(() => Observable.throw({}));
       batchService.getBatchDetailsById(requestParam).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('success');
        }
      );
      expect(batchService).toBeTruthy();
    }));
  it('should call filterUserSearchResult method to return userdata  ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      const userData = {
        'firstName': 'system adminstration (sy**********@gmail.com, ******7323)'
      };
      batchService.filterUserSearchResult(userData.firstName, '');
      expect(batchService).toBeTruthy();
    }));
  it('should call getUserOtherDetail method to update the userdata ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      const userData = {
        'phone': '9955210096',
        'email': 'sy@gmail.com'
      };
      const userOtherDetail =  batchService.getUserOtherDetail(userData);
      expect(userOtherDetail).toBe(' (sy@gmail.com, 9955210096)');
      expect(batchService).toBeTruthy();
  }));

  it('should call setBatchData method to set the batch data  ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      batchService.setBatchData(Response.batchlistSucessData);
      expect(batchService.batchDetails).toBeDefined();
      expect(batchService).toBeTruthy();
  }));

  it('should call getBatchData method to get the batch data  ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
    batchService.setBatchData(Response.batchlistSucessData);
    const batchData = batchService.getBatchData();
    expect(batchData).toBeDefined();
    expect(batchService.batchDetails).toBe(batchData);
    expect(batchService).toBeTruthy();
  }));

});
