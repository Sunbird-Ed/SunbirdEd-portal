import { TestBed } from '@angular/core/testing';
import { PopupControlService } from './popup-control.service';

describe('PopupControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create PopupControlService', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    expect(service).toBeTruthy();
  });

  it('should change the status of frameworkPopup to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('frameworkPopup', false);
    expect(service.frameworkPopup).toBeFalsy();
  });

  it('should change the status of frameworkPopup to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('frameworkPopup', true);
    expect(service.frameworkPopup).toBeTruthy();
  });

  it('should change the status of termsAndCondPopup to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('termsAndCondPopup', false);
    expect(service.termsAndCondPopup).toBeFalsy();
  });

  it('should change the status of termsAndCondPopup to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('termsAndCondPopup', true);
    expect(service.termsAndCondPopup).toBeTruthy();
  });

  it('should change the status of userVerificationPopup to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('userVerificationPopup', false);
    expect(service.userVerificationPopup).toBeFalsy();
  });

  it('should change the status of userVerificationPopup to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('userVerificationPopup', true);
    expect(service.userVerificationPopup).toBeTruthy();
  });

  it('should change the status of locationPopup to false by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('locationPopup', false);
    expect(service.locationPopup).toBeFalsy();
  });

  it('should change the status of locationPopup to true by calling changePopupStatus', () => {
    const service: PopupControlService = TestBed.get(PopupControlService);
    spyOn(service, 'changePopupStatus').and.callThrough();
    service.changePopupStatus('locationPopup', true);
    expect(service.locationPopup).toBeTruthy();
  });

});
