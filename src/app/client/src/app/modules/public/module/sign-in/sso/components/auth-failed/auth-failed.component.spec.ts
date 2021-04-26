import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf} from 'rxjs';
import {ResourceService, InterpolatePipe} from '@sunbird/shared';
import {TenantService} from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import {AuthFailedComponent} from './auth-failed.component';

describe('AuthFailedComponent', () => {
  let component: AuthFailedComponent;
  let fixture: ComponentFixture<AuthFailedComponent>;

  const fakeActivatedRoute = {
    'queryParams': observableOf({userId: 'mock user ID', identifier: 'email', identifierValue: 'as'}),
  };
  const resourceBundle = {
    languageSelected$: observableOf({})
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [AuthFailedComponent, InterpolatePipe],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: ResourceService, useValue: resourceBundle},
        {provide: TenantService, useValue: {tenantData$: observableOf('')}}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
