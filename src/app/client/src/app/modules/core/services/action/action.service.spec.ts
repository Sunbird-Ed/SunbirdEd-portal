import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ActionService } from './action.service';

describe('ActionService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({}));

  //  OLD XIT
 xit('should be created', () => {
    const service: ActionService= <any> TestBed.inject(ActionService);
    expect(service).toBeTruthy();
  });
});
