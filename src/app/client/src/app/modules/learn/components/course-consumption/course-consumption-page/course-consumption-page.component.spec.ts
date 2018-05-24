import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionPageComponent } from './course-consumption-page.component';
import {SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {CourseConsumptionService, CourseProgressService} from '../../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

describe('CourseConsumptionPageComponent', () => {
  let component: CourseConsumptionPageComponent;
  let fixture: ComponentFixture<CourseConsumptionPageComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
  'queryParams':  Observable.from([{ subject: ['English'] }])
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule, Ng2IziToastModule],
      declarations: [ CourseConsumptionPageComponent ],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute },
        CourseConsumptionService,  { provide: Router, useClass: RouterStub },
        CourseProgressService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
