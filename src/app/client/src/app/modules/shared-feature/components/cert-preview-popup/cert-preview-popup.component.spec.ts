import { ResourceService } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { CertPreviewPopupComponent } from './cert-preview-popup.component';

describe('CertPreviewPopup component', ()=>{
  let certPreviewPopupComponent: CertPreviewPopupComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const mockDomSanitizer: Partial<DomSanitizer> = {
    bypassSecurityTrustResourceUrl: jest.fn().mockReturnValue(true)
  };

  beforeAll(() => {
    certPreviewPopupComponent = new CertPreviewPopupComponent(
      mockResourceService as ResourceService,
      mockDomSanitizer as DomSanitizer
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance of certPreviewPopupComponent", ()=> {
    expect(certPreviewPopupComponent).toBeTruthy();
  });

  it("should call deny on onPopState call", ()=> {
    certPreviewPopupComponent.modal = {
        deny:jest.fn()
    };
    certPreviewPopupComponent.onPopState('');
    expect(certPreviewPopupComponent.modal.deny).toBeCalled();
  });

  describe('closeModal', ()=> {
    it('should call deny if condition is true', ()=> {
      certPreviewPopupComponent.closeModal();
      expect(certPreviewPopupComponent.modal.deny).toBeCalled();
    });

    it('should emit data by close event emitter', ()=> {
      certPreviewPopupComponent.close = {
        emit: jest.fn()
      } as any;
      certPreviewPopupComponent.template = 'user';
      const argData = {name: 'test', template: 'user'};
      certPreviewPopupComponent.closeModal('test');
      expect(certPreviewPopupComponent.close.emit).toBeCalledWith(argData);
    });
  });

  it('should handle certTemplateUrl call', ()=> {
    jest.spyOn(certPreviewPopupComponent,'certTemplateURL');
    certPreviewPopupComponent.certTemplateURL('/test');
    expect(certPreviewPopupComponent['sanitizer'].bypassSecurityTrustResourceUrl).toBeCalledWith('/test');
    expect(certPreviewPopupComponent.certTemplateURL).toHaveReturnedWith(true);
  });

  it('should not call bypassSecurityTrustResourceUrl if there is no url ', ()=> {
    certPreviewPopupComponent.certTemplateURL(null);
    expect(certPreviewPopupComponent['sanitizer'].bypassSecurityTrustResourceUrl).not.toBeCalled();
    expect(certPreviewPopupComponent.certTemplateURL).toHaveReturnedWith(undefined);
  });
});