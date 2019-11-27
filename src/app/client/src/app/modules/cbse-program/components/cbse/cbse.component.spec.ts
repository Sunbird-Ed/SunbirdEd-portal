import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CbseComponent } from './cbse.component';
import { SuiModule } from 'ng2-semantic-ui';
import { mockResponse } from './cbse.component.spec.data';

describe('CbseComponent', () => {
  let component: CbseComponent;
  let fixture: ComponentFixture<CbseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbseComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), SuiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbseComponent);
    component = fixture.componentInstance;
    component.userProfile = mockResponse.userProfile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
