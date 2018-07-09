import { ProfileCardComponent } from './profile-card.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService, CoursesService, LearnerService } from '@sunbird/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import * as mockData from './profile-card.component.spec.data';
const testData = mockData.mockRes;
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
describe('ProfileCardComponent', () => {
  let component: ProfileCardComponent;
  let fixture: ComponentFixture<ProfileCardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), SuiModule],
      declarations: [ProfileCardComponent],
      providers: [ResourceService, UserService, LearnerService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardComponent);
    component = fixture.componentInstance;
  });
  it('for success test data', () => {
    component.profile = testData.successData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div span.profile-update-subheading span').innerText).toEqual('69');
    expect(fixture.nativeElement.querySelector('div.padding-top-5').innerText).toEqual('Add dob');
  });
  it('for no test data', () => {
    component.profile = testData.parsedData;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div span.profile-update-subheading span').innerText).toEqual('');
    expect(fixture.nativeElement.querySelector('div.padding-top-5')).toEqual(null);
  });
});
