import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ActionService } from './action.service';

// NEW xdescribe
xdescribe('ActionService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ActionService = TestBed.inject(ActionService);
    expect(service).toBeTruthy();
  });
});
