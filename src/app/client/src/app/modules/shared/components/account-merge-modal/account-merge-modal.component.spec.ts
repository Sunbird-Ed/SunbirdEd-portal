import {ResourceService} from '../../services';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AccountMergeModalComponent } from './account-merge-modal.component';
import { of, throwError } from 'rxjs';

xdescribe('AccountMergeModal component', ()=> {
  let accountMergeModalComponent: AccountMergeModalComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const mockRouter: Partial<Router> = {
    url: 'user/test'
  };
  const ObservableData = {
    responseCode: 'OK',
    result: {
      status: 'SUCCESS',
      redirectUrl: '/test'
    }
  };
  const mockHttp: Partial<HttpClient> = {
    get: jest.fn().mockReturnValue(of(ObservableData))
  };

  beforeAll(() => {
    accountMergeModalComponent = new AccountMergeModalComponent(
      mockResourceService as ResourceService,
      mockRouter as Router,
      mockHttp as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should  create an instance of accountMergeModalComponent', () => {
    expect(accountMergeModalComponent).toBeTruthy();
  });

  it('should set instance property when instance of component is created', ()=> {
    expect(accountMergeModalComponent.instance).toBeDefined();
    expect(accountMergeModalComponent.instance).toEqual('SUNBIRD');
  });

  xit('should set telemetry data after the component is initialized', () => {
    const responseData1 = [
        {id: 'user:account:merge', type: 'Feature'}, {id: 'SB-13927', type: 'Task'}
    ];
    const responseData2 = {
        id: 'merge-account-button',
        type: 'click',
        pageid: 'test'
    };
    jest.spyOn(accountMergeModalComponent, 'setTelemetryData');
    accountMergeModalComponent.ngOnInit();
    expect(accountMergeModalComponent.setTelemetryData).toBeCalled();
    expect(accountMergeModalComponent.telemetryCdata).toBeDefined();
    expect(accountMergeModalComponent.mergeIntractEdata).toBeDefined();
    expect(accountMergeModalComponent.telemetryCdata).toEqual(responseData1);
    expect(accountMergeModalComponent.mergeIntractEdata).toEqual(responseData2);
  });

  it('should emit by closeAccountMergeModal and  call deny on modal after closeModal call', ()=> {
    accountMergeModalComponent.closeAccountMergeModal = {
      emit: jest.fn()
    } as any;
    accountMergeModalComponent.modal={
        deny:jest.fn()
    };
    jest.spyOn(accountMergeModalComponent.closeAccountMergeModal,'emit');
    jest.spyOn(accountMergeModalComponent.modal,'deny');
    accountMergeModalComponent.closeModal();
    expect(accountMergeModalComponent.closeAccountMergeModal.emit).toBeCalled();
    expect(accountMergeModalComponent.modal.deny).toBeCalled();
  });

  describe('initiateMerge', ()=> {
    it('should call http get function with appropriate url', ()=> {
      const responseUrl = '/user/session/save?redirectUri=user/test'
      jest.spyOn(accountMergeModalComponent.http,'get');
      accountMergeModalComponent.initiateMerge();
      expect(accountMergeModalComponent.http.get).toBeCalledWith(responseUrl);
    });

    it('should redirect if get request fire an observable and conditions are true', ()=> {
      jest.spyOn(accountMergeModalComponent,'redirect');
      accountMergeModalComponent.initiateMerge();
      expect(accountMergeModalComponent.redirect).toBeCalledWith('/test');
    });

    it('should close modal if any of the conditions are false on the data emitted by the observable', ()=> {
      const closeModalSpy = jest.spyOn(accountMergeModalComponent,'closeModal');
      ObservableData.result.status = 'FAILURE';
      accountMergeModalComponent.initiateMerge();
      expect(closeModalSpy).toBeCalled();
    });

    it('should close modal in case of thrown error', ()=> {
      const errorResponse: HttpErrorResponse = {status: 401} as HttpErrorResponse;
      mockHttp.get = jest.fn().mockReturnValue(throwError(errorResponse));
      const closeModalSpy = jest.spyOn(accountMergeModalComponent,'closeModal');
      accountMergeModalComponent.initiateMerge();
      expect(closeModalSpy).toBeCalled();
    });
  });

  it('should redirect into appropriate url', ()=> {
    const redirectUrl = '/test';
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: ''
        }
    });
    jest.spyOn(accountMergeModalComponent,'closeModal');
    accountMergeModalComponent.redirect(redirectUrl);
    expect(window.location.href).toEqual(redirectUrl);
    expect(accountMergeModalComponent.closeModal).toBeCalled();
  });

  it('should call deny on modal property on ngOnDestroy call', ()=> {
    jest.spyOn(accountMergeModalComponent.modal,'deny');
    accountMergeModalComponent.ngOnDestroy();
    expect(accountMergeModalComponent.modal.deny).toBeCalled();
  });
});