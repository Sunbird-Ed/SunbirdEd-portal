import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ActionService } from './action.service';

describe('ActionService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ActionService = TestBed.get(ActionService);
    expect(service).toBeTruthy();
  });
});
