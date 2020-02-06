import { TestBed } from '@angular/core/testing';
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsetService } from './itemset.service';
import { ConfigService, ToasterService } from '@sunbird/shared';
import {ActionService } from '@sunbird/core';
import {mockItemsetData} from './itemset.mock.service.data';

describe('ItemsetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsetService, ConfigService, ActionService, ToasterService]
    });
  });

  // tslint:disable-next-line:only-arrow-functions
  function setup() {
    const itemsetService: ItemsetService = TestBed.get(ItemsetService);
    const actionService: ActionService = TestBed.get(ActionService);
    const httpTestingController = TestBed.get(HttpTestingController);
    return {itemsetService, actionService, httpTestingController };
  }


  it('should be created', () => {
    const {itemsetService} = setup();
    expect(itemsetService).toBeTruthy();
  });

  it('Should read itemset details', () => {
    const { itemsetService, actionService } = setup();
    spyOn(actionService, 'get').and.returnValue(observableOf(mockItemsetData.readSuccess));
    itemsetService.readItemset('do_212940106188939264137').subscribe(data => {
      expect(data.responseCode).toBe('OK');
    });
  });

  it('Should create itemset', () => {
    const { itemsetService, actionService } = setup();
    spyOn(actionService, 'post').and.returnValue(observableOf(mockItemsetData.createSuccess));
    itemsetService.createItemset(mockItemsetData.createBody).subscribe(data => {
      expect(data.responseCode).toBe('OK');
    });
  });

  it('Should send itemset for review', () => {
    const { itemsetService, actionService } = setup();
    spyOn(actionService, 'post').and.returnValue(observableOf(mockItemsetData.reviewSuccess));
    itemsetService.reviewItemset('do_212940106188939264137').subscribe(data => {
      expect(data.responseCode).toBe('OK');
    });
  });

  it('Should update itemset', () => {
    const { itemsetService, actionService } = setup();
    spyOn(actionService, 'patch').and.returnValue(observableOf(mockItemsetData.updateSuccess));
    itemsetService.updateItemset(mockItemsetData.updateBody, 'do_212940106188939264137').subscribe(data => {
      expect(data.responseCode).toBe('OK');
    });
  });


});
