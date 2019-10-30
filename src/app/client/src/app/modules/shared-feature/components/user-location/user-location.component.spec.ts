import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {UserLocationComponent} from './user-location.component';
import {ResourceService, ToasterService, ConfigService, BrowserCacheTtlService} from '@sunbird/shared';
import {ProfileService} from '@sunbird/profile';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CacheService} from 'ng2-cache-service';
import {DeviceDetectorService} from 'ngx-device-detector';


describe('UserLocationComponent', () => {
  let component: UserLocationComponent;
  let fixture: ComponentFixture<UserLocationComponent>;
  let configService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [UserLocationComponent],
      providers: [ResourceService, ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService,
        DeviceDetectorService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.get(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
