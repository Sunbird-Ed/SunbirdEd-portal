import { ResourceService } from '@sunbird/shared';
import { ConfirmationPopupComponent } from './confirmation-popup.component';

describe('ConfirmationPopup component', ()=> {
  let confirmationPopupComponent: ConfirmationPopupComponent
  const mockResourceService: Partial<ResourceService> = {};

  beforeAll(() => {
    confirmationPopupComponent = new ConfirmationPopupComponent(
      mockResourceService as ResourceService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of confirmationPopupComponent", ()=> {
    expect(confirmationPopupComponent).toBeTruthy();
  });

  it("should close modal on onPopState call", ()=> {
    confirmationPopupComponent.confirmationModal = {
      deny: jest.fn()
    };
    confirmationPopupComponent.close = {
      emit: jest.fn()
    } as any;
    jest.spyOn(confirmationPopupComponent,'closeModal');
    confirmationPopupComponent.onPopState('');
    expect(confirmationPopupComponent.closeModal).toBeCalled();
    expect(confirmationPopupComponent.confirmationModal.deny).toBeCalled();
    expect(confirmationPopupComponent.close.emit).toBeCalled();
  });

  it("should navigate to add certificate", ()=> {
    const argData = {mode: 'add-certificates', batchId: '1'};
    confirmationPopupComponent.batchId = '1';
    confirmationPopupComponent.navigateToAddCertificate();
    expect(confirmationPopupComponent.confirmationModal.deny).toBeCalled();
    expect(confirmationPopupComponent.close.emit).toBeCalledWith(argData);
  });
});