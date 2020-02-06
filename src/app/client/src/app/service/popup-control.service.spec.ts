import { TestBed } from '@angular/core/testing';
import { PopupControlService } from './popup-control.service';

describe('PopupControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create PopupControlService', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    expect(service).toBeTruthy();
  });

  it('should change the status of showFrameWorkPopUp to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('showFrameWorkPopUp', false);
    expect(service.showFrameWorkPopUp).toBeFalsy();
  });

  it('should change the status of showFrameWorkPopUp to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('showFrameWorkPopUp', true);
    expect(service.showFrameWorkPopUp).toBeTruthy();
  });

  it('should change the status of showTermsAndCondPopUp to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('showTermsAndCondPopUp', false);
    expect(service.showTermsAndCondPopUp).toBeFalsy();
  });

  it('should change the status of showTermsAndCondPopUp to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('showTermsAndCondPopUp', true);
    expect(service.showTermsAndCondPopUp).toBeTruthy();
  });

  it('should change the status of showUserVerificationPopup to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('showUserVerificationPopup', false);
    expect(service.showUserVerificationPopup).toBeFalsy();
  });

  it('should change the status of showUserVerificationPopup to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('showUserVerificationPopup', true);
    expect(service.showUserVerificationPopup).toBeTruthy();
  });

  it('should change the status of isLocationConfirmed to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('isLocationConfirmed', false);
    expect(service.isLocationConfirmed).toBeFalsy();
  });

  it('should change the status of isLocationConfirmed to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('isLocationConfirmed', true);
    expect(service.isLocationConfirmed).toBeTruthy();
  });

});
