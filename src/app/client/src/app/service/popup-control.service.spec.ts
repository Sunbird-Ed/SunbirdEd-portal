import { TestBed } from '@angular/core/testing';
import { PopupControlService } from './popup-control.service';
import { configureTestSuite } from '@sunbird/test-util';
describe('PopupControlService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create PopupControlService', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    expect(service).toBeTruthy();
  });

  it('should change the status of checkPopupStatus to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus(true);
    const popupStatus = service.checkPopupStatus;
    popupStatus.subscribe(result => {
      expect(result).toBeTruthy();
    });
  });

  it('should change the status of checkPopupStatus to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus(false);
    const popupStatus = service.checkPopupStatus;
    popupStatus.subscribe(result => {
      expect(result).toBeFalsy();
    });
  });

});
