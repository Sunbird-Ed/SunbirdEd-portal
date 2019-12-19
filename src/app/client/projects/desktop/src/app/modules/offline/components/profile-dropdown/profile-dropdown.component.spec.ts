import { UserProfileModule } from '@sunbird/user-profile';
import { By } from '@angular/platform-browser';
import { TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDropdownComponent } from './profile-dropdown.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileDropdownComponent', () => {
  let component: ProfileDropdownComponent;
  let fixture: ComponentFixture<ProfileDropdownComponent>;
  const resourceBundle = {
    instance: 'tenant',
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
class ActivatedRouteStub {
  root: {
    firstChild: {
      snapshot: {
        data: {
          telemetry: {
            env: 'library',
            pageid: 'library'
          }
        }
      }
    }
  };
}
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileDropdownComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule.forRoot(), UserProfileModule],
      providers: [TelemetryService,
      {provide: ActivatedRoute, useClass: ActivatedRouteStub},
      {provide: ResourceService, useValue: resourceBundle},
    ]
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
    component.ngOnInit();
    expect(component.instance).toEqual('TENANT');
  });

  it('should call SetTelemetry', () => {
    spyOn(component, 'setTelemetry');
    const button = fixture.debugElement.query(By.css('#about_us')).nativeElement;
    button.click();
    expect(button.innerText).toContain('About us TENANT');
    expect(component.setTelemetry).toHaveBeenCalled();
  });
});
