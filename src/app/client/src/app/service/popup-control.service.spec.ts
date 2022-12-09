import { PopupControlService } from './popup-control.service';
describe('PopupControlService', () => {
    let popupControlService: PopupControlService;
    beforeEach(() => popupControlService = new PopupControlService());

    it('should create PopupControlService', () => {
        expect(popupControlService).toBeTruthy();
    });

    it('should change the status of checkPopupStatus to true by calling changePopupStatus', () => {
        jest.spyOn(popupControlService, 'changePopupStatus');
        popupControlService.changePopupStatus(true);
        const popupStatus = popupControlService.checkPopupStatus;
        popupStatus.subscribe(result => {
            expect(result).toBeTruthy();
        });
    });

    it('should change the status of checkPopupStatus to false by calling changePopupStatus', () => {
        jest.spyOn(popupControlService, 'changePopupStatus');
        popupControlService.changePopupStatus(true);
        const popupStatus = popupControlService.checkPopupStatus;
        popupStatus.subscribe(result => {
            expect(result).toBeFalsy();
        });
    });

});