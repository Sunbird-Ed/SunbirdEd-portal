import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '../../services';
import * as _ from 'lodash-es';
import { OfflineBannerComponent } from './offline-banner.component';

describe('offline-banner component', () => {
  let component: OfflineBannerComponent;
  const mockRouter: Partial<Router> = {
    navigate: jest.fn(),
  };
  const mockResourceService: Partial<ResourceService> = {
    messages: {
      fmsg: {
        m0004: "Could not fetch data, try again later"
      },
      imsg: {
        m0034: 'As the content is from an external source, it will be opened in a while.'
      }
    },
    frmelmnts: { cert: { lbl: { imageErrorMsg: "The image exceeds the maximum supported file size" } } }
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      data: {
        telemetry: { env: 'course', pageid: 'validate-certificate', type: 'view' }
      },
      params: { uuid: '9545879' },
      queryParams: { clientId: 'android', context: '{"env":"course","pageid":"validate-certificate","type":"view"}' }
    } as any
  };
  beforeAll(() => {
    component = new OfflineBannerComponent(
      mockRouter as Router,
      mockResourceService as ResourceService,
      mockActivatedRoute as ActivatedRoute
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should  create an instance of offline-banner component ", () => {
    expect(component).toBeTruthy();
  });
  describe("ngOnInit", () => {
    it('should call the onInit function of the component', () => {
      jest.spyOn(component, 'showOfflineBanner');
      component.ngOnInit();
      expect(component.showOfflineBanner).toHaveBeenCalled();
      expect(component.showBanner).toBeFalsy();
    });
    it('should call the onInit function of the component', () => {
      component.slug = 'sunbird';
      component.orgList = ['sunbird','test','org001'];
      component.ngOnInit();
      expect(component.showOfflineBanner).toHaveBeenCalled();
      expect(component.showBanner).toBeTruthy();
    });
    it('should call the navigateToDownloadApkPage function of the component', () => {
      jest.spyOn(component, 'navigateToDownloadApkPage');
      component.navigateToDownloadApkPage();
      expect(component.navigateToDownloadApkPage).toHaveBeenCalled();
    });
  });
});