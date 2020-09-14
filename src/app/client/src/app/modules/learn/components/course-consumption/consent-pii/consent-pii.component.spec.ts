import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { ConsentPiiComponent } from './consent-pii.component';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { UserService, CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockData } from './consent-pii.component.spec.data';

describe('ConsentPiiComponent', () => {
  let component: ConsentPiiComponent;
  let fixture: ComponentFixture<ConsentPiiComponent>;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      btn: {
        close: 'Close'
      },
      cert: {
        lbl: {
          batchCreateSuccess: 'Batch created successfully.',
          batchUpdateSuccess: 'Batch updated successfully.',
          addCert: 'Add certificate'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ ConsentPiiComponent ],
      imports: [SuiModule, SharedModule.forRoot(), CoreModule, HttpClientTestingModule],
      providers: [
        {provide: ResourceService, useValue: resourceBundle}, ToasterService, UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentPiiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user Information', () => {
    component.consent = 'Yes';
    const userService = TestBed.get(UserService);
    userService._userProfile = MockData.userProfile;
    spyOn(component, 'getUserInformations').and.callThrough();
    component.ngOnInit();
    expect(component.userInformations['name']).toEqual(`${MockData.userProfile.firstName} ${MockData.userProfile.lastName}`);
  });



});
