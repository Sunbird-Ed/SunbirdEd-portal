import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui-v9';
import { configureTestSuite } from '@sunbird/test-util';
import {MergeAccountStatusComponent} from './merge-account-status.component';
import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf} from 'rxjs';
import {ResourceService, SharedModule} from '@sunbird/shared';
import {TenantService} from '@sunbird/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MergeAccountStatusComponent', () => {
  let component: MergeAccountStatusComponent;
  let fixture: ComponentFixture<MergeAccountStatusComponent>;

  const fakeActivatedRoute = {
    'queryParams': observableOf({isMergeSuccess: false, redirectUri: '/learn'}),
  };
  const resourceBundle = {
    languageSelected$: observableOf({})
  };
  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SharedModule.forRoot(), BrowserAnimationsModule],
      declarations: [MergeAccountStatusComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: TenantService, useValue: {tenantData$: observableOf('')}},
        {provide: ResourceService, useValue: resourceBundle},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
