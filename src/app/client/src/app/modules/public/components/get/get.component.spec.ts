import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetComponent } from './get.component';
import { TelemetryModule } from '@sunbird/telemetry';
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot(), TelemetryModule.forRoot(), Ng2IziToastModule],
      declarations: [ GetComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to dialcode search when user enters data', () => {
    const route = TestBed.get(Router);
    component.searchKeyword = 'test';
    component.navigateToSearch();
    fixture.detectChanges();
    expect(route.navigate).toHaveBeenCalledWith(['/get/dial', component.searchKeyword]);
  });
});
