import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { AvatarModule } from 'ngx-avatar';
import { GuestProfileComponent } from './guest-profile.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreModule, UserService, DeviceRegisterService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('GuestProfileComponent', () => {
  let component: GuestProfileComponent;
  let fixture: ComponentFixture<GuestProfileComponent>;

  const resourceBundle = {
    'frmelemnts': {
      'lbl' : { }
    },
    'frmelmnts': {
      'instn': {
      },
      'lbl': {
      },
    },
    'messages': {
      'smsg': {
        'm0058': 'User preference updated successfully'
      },
      'fmsg': {
      },
      'emsg': {
      }
    },
    languageSelected$: of({})
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestProfileComponent],
      imports: [
        CommonModule, SharedModule.forRoot(), CoreModule, HttpClientTestingModule,
        RouterTestingModule, TelemetryModule, AvatarModule,
      ],
      providers: [{ provide: ResourceService, useValue: resourceBundle }, TelemetryService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch Guest User', () => {
    const userService = TestBed.get(UserService);
    spyOn(userService, 'getGuestUser').and.returnValue(of({ result: { name: 'Guest' } }));
    component.getGuestUser();
    expect(userService.getGuestUser).toHaveBeenCalled();
  });

  it('should call getLocation', () => {
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    spyOn(deviceRegisterService, 'fetchDeviceProfile').and.returnValue(of({ result: { ipLocation: {}, userDeclaredLocation: {} } }));
    component.getLocation();
    expect(deviceRegisterService.fetchDeviceProfile).toHaveBeenCalled();
    expect(component.deviceProfile).toBeDefined();
  });

  it('should update profile for desktop', () => {
    component.frameworkModal = {
      modal: {
        deny: jasmine.createSpy('deny')
      }
    };
    component.showEdit = true;
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
    component.guestUser = { framework: {} };
    component.isDesktop = true;
    spyOn(component, 'updateGuestUser');
    component.updateProfile(event);
    expect(component.updateGuestUser).toHaveBeenCalled();
    expect(component.frameworkModal.modal.deny).toHaveBeenCalled();
  });

  it('should update profile for portal', () => {
    component.frameworkModal = {
      modal: {
        deny: jasmine.createSpy('deny')
      }
    };
    component.showEdit = true;
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
    component.guestUser = { framework: {} };
    component.isDesktop = false;
    spyOn(component, 'getGuestUser');
    component.updateProfile(event);
    expect(component.getGuestUser).toHaveBeenCalled();
  });

  it('should update Guest User', () => {
    const user = {
      _id: 'abcd',
      name: 'Guest',
      framework: { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] }
    };
    const userService = TestBed.get(UserService);
    spyOn(component, 'getGuestUser');
    spyOn(userService, 'updateAnonymousUserDetails').and.returnValue(of({}));
    component.updateGuestUser(user);
    expect(userService.updateAnonymousUserDetails).toHaveBeenCalled();
    expect(component.getGuestUser).toHaveBeenCalled();
  });

  it('should close popUp', () => {
    component.showEditUserDetailsPopup = true;
    spyOn(component, 'getLocation');
    component.closeEditDetailsPopup();
    expect(component.getLocation).toHaveBeenCalled();
    expect(component.showEditUserDetailsPopup).toBe(false);
  });

  it('should convert to string if value is array', () => {
    const stringArray = ['one', 'tow', 'three'];
    const result = component.convertToString(stringArray);
    expect(result).toString();
  });

  it('should return undefined if value is not an array', () => {
    const stringArray = 'One';
    const result = component.convertToString(stringArray);
    expect(result).toBeUndefined();
  });


  it('should terminate all subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();

  });

});
