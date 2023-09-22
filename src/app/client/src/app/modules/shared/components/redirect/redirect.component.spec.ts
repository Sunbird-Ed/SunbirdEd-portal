import { ToasterService } from '../../services';
import { ResourceService, NavigationHelperService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { RedirectComponent } from './redirect.component';
import { of } from "rxjs";

describe('redirect component', () => {
  let component: RedirectComponent;
  const obj = {
    context: { env: 'redirect' },
    edata: {
      type: 'view',
      pageid: 'validate-certificate',
      uri: undefined,
      duration: 10
    }
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
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn(),

  };
  const mockToasterService: Partial<ToasterService> = {
    warning: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    setNavigationUrl: jest.fn(),
    navigateToLastUrl: jest.fn()
  };
  beforeAll(() => {
    component = new RedirectComponent(
      mockResourceService as ResourceService,
      mockActivatedRoute as ActivatedRoute,
      mockRouter as Router,
      mockToasterService as ToasterService,
      mockNavigationHelperService as NavigationHelperService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should  create an instance of redirect component ", () => {
    expect(component).toBeTruthy();
  });
  it("should call ngAfterViewInit", (done) => {
    mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
    component.ngAfterViewInit();
    setTimeout(() => {
      expect(JSON.stringify(component.telemetryImpression)).toEqual(JSON.stringify(obj));
      done()
    });
  });
  describe("ngOnInit", () => {
    it('should call the onInit function and openWindow is called', () => {
      jest.spyOn(component, 'openWindow');
      component.ngOnInit();
      expect(mockToasterService.warning).toHaveBeenCalled();
    });
  });
});