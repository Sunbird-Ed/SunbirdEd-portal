import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { BackButtonComponent } from './back-button.component';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { fakeActivatedRoute } from './../../services/groups/groups.service.spec.data';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackButtonComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        TelemetryService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component['groupService'], 'addTelemetry');
    spyOn(component['groupService'], 'goBack');
    component.goBack();
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith({id: 'back-button'}, fakeActivatedRoute.snapshot, [{id: '123', type: 'group'}]);
    expect(component['groupService'].goBack).toHaveBeenCalled();

  });
});
