import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateContactComponent } from './update-contact.component';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceService} from '@sunbird/shared';

describe('UpdateContactComponent', () => {
  let component: UpdateContactComponent;
  let fixture: ComponentFixture<UpdateContactComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'sso-sign-in', pageid: '/update-contact', uri: '/update-contact',
          type: 'view', mode: 'self', uuid: 'hadfisgefkjsdvv'
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(),
        RouterTestingModule],
      declarations: [ UpdateContactComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }, ResourceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
