import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TenantService } from '@sunbird/core';
import { AuthFailedComponent } from './auth-failed.component';

describe('AuthFailedComponent', () => {
  let authFailedComponent: AuthFailedComponent;
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({tncVersion: '4', userId: '1234', identifierType: 'test', identifierValue: '111', tncAccepted: true}),
    params: of({ collectionId: '123' }),
  };
  const mockResourceService: Partial<ResourceService> = {
    messages: ''
  };
  const mockTenantService: Partial<TenantService> = {
    tenantData$: of({ favicon: 'sample-favicon', tenantData: { logo: 'test', titleName: 'SUNBIRD' } }) as any
  };
  const data = {
    id: 'api.content.read',
    ver: '1.0',
    ts: '2018-05-03T10:51:12.648Z',
    params: 'params',
    responseCode: 'OK',
    result: {
      response: {
        contents: [
          {
            createdOn: '12345',
            identifier: 'do_3129981407884492801158'
          },
          {
            createdOn: '12345678',
            identifier: 'do_3129981407884492801159'
          },
          {
            createdOn: '1234567890',
            identifier: 'do_3129981407884492801160'
          }
        ]
      }
    }
  };
  beforeAll(() => {
    authFailedComponent = new AuthFailedComponent(
      mockActivatedRoute as ActivatedRoute,
      mockResourceService as ResourceService,
      mockTenantService as TenantService
    );
    authFailedComponent.instance = 'SUNBIRD';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of AuthFailedComponent', () => {
    expect(authFailedComponent).toBeTruthy();
  });

  it('should call ngOnDestroy', () => {
    // arrange
    authFailedComponent.tenantDataSubscription = of().subscribe();
    // act
    authFailedComponent.ngOnDestroy();
    // assert
    expect(authFailedComponent.tenantDataSubscription).toBeDefined();
  });

  it('should call the onInit method', () => {
    // arrange
      const tenantObject = authFailedComponent.tenantService.tenantData$.subscribe( (data) => {
      });
    // act
    authFailedComponent.ngOnInit();
    // assert
    authFailedComponent.tenantService.tenantData$.subscribe( (data) => {
      expect(authFailedComponent.logo).toBe('test');
      expect(authFailedComponent.tenantName).toBe('SUNBIRD');
    });

  });

  it('should call createNewUser', () => {
    const url = 'http://localhost/';
    // act
    authFailedComponent.createNewUser();
    expect(window.location.href).toEqual(url);
  });
});



