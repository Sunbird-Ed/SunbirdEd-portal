import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDropdownComponent } from './profile-dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileDropdownComponent', () => {
  let component: ProfileDropdownComponent;
  let fixture: ComponentFixture<ProfileDropdownComponent>;

  const resourceBundle = {
    frmelmnts: {
      lnk: {
        profile: 'Profile'
      },
      lbl: {
        desktop: {
          about_us: 'About us {instance}'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileDropdownComponent ],
      imports: [SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule],
      providers: [ {provide: ResourceService, useValue: resourceBundle} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
