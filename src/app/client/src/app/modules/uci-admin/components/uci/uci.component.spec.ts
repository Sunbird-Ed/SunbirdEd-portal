import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UciComponent } from './uci.component';
import { ConfigService } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { UserService } from '../../../core/services/user/user.service';
import { configureTestSuite } from '@sunbird/test-util';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CacheService } from 'ng2-cache-service';

describe('UciComponent', () => {
  let baseHref;
  let component: UciComponent;
  let fixture: ComponentFixture<UciComponent>;
  let userMockData = {
    'userProfile': {
      'missingFields': [],
      'updatedDate': '2018-07-09 16:07:35:977+0000',
      'completeness': 100,
      'id': '159e93d1-da0c-4231-be94-e75b0c226d7c',
      'identifier': '159e93d1-da0c-4231-be94-e75b0c226d7c',
      'rootOrgId': 'ORG_001',
      'firstName': 'Sunil',
      'phone': '******7878',
      'dob': '1982-01-01',
      'status': 1,
      'lastName': 'Pandith',
      'gender': 'Male',
      'email': 'su************@gmail.com',
      'phoneverified': null,
      'profileSummary': '.aa .   ',
      'userName': 'sunil1as990',
      'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
      'emailVerified': null,
      'lastLoginTime': 1534920693649,
      'createdDate': '2017-11-03 05:28:41:536+0000',
      'createdBy': '',
      'location': 'Bangaloree',
      'rootOrgAdmin': false
    }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UciComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        HttpClient, UserService, ConfigService, { provide: APP_BASE_HREF, useValue: baseHref }, CacheService
      ],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user profile details', () => {
    const userService = TestBed.get(UserService);
    const configService = TestBed.get(ConfigService);
    expect(component.blobUrl).toBeDefined();
    component.ngOnInit();
    userService._userData$.next({ err: null, userProfile: userMockData.userProfile });
    expect(component.userProfile).toEqual(userMockData.userProfile);
    expect(component.url).toEqual(configService.urlConFig.URLS.UCI);
  });

});
