import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetComponent } from './get.component';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { ResourceService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';

describe('GetComponent', () => {
  let component: GetComponent;
  let fixture: ComponentFixture<GetComponent>;
  const fakeActivatedRoute = {
    'params': observableOf(),
    'queryParams': observableOf(),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [ GetComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, ResourceService, TelemetryService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create get component', () => {
    expect(component).toBeTruthy();
    expect(component.searchKeyword).toBeUndefined();
  });

  it('should generate Telemetry Impression event onLoad', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'impression');
    expect(telemetryService.impression).toBeTruthy();
  });

  it('should not navigate to dialcode search when input field is empty or only spaces', () => {
    const route = TestBed.get(Router);
    spyOn(component, 'navigateToSearch');
    component.searchKeyword = ' ';
    component.navigateToSearch();
    fixture.detectChanges();
    expect(route.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to dialcode search when user enters data', () => {
    const route = TestBed.get(Router);
    component.searchKeyword = 'test';
    component.navigateToSearch();
    fixture.detectChanges();
    expect(route.navigate).toHaveBeenCalledWith(['/get/dial', component.searchKeyword]);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });
});
