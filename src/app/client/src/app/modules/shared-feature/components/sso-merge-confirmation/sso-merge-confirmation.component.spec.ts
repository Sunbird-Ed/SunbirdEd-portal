import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';

import {SsoMergeConfirmationComponent} from './sso-merge-confirmation.component';
import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf} from 'rxjs';
import {InterpolatePipe, ResourceService} from '@sunbird/shared';


describe('SsoMergeConfirmationComponent', () => {
  let component: SsoMergeConfirmationComponent;
  let fixture: ComponentFixture<SsoMergeConfirmationComponent>;
  const resourceBundle = {
    languageSelected$: observableOf({})
  };
  const fakeActivatedRoute = {
    'params': observableOf(),
    'queryParams': observableOf()
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, TelemetryModule.forRoot()],
      declarations: [SsoMergeConfirmationComponent, InterpolatePipe],
      providers: [
        {provide: ResourceService, useValue: resourceBundle},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoMergeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
