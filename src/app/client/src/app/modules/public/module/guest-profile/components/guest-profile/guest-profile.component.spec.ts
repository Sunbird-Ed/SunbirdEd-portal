import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { AvatarModule } from 'ngx-avatar';
import { GuestProfileComponent } from './guest-profile.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('GuestProfileComponent', () => {
  let component: GuestProfileComponent;
  let fixture: ComponentFixture<GuestProfileComponent>;

  const resourceBundle = {
    'frmelmnts': {
      'instn': {
      },
      'lbl': {
      },
    },
    'messages': {
      'smsg': {
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
});
