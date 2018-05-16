import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionHeaderComponent } from './course-consumption-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {CourseConsumptionService} from '../../../services';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';

describe('CourseConsumptionHeaderComponent', () => {
  let component: CourseConsumptionHeaderComponent;
  let fixture: ComponentFixture<CourseConsumptionHeaderComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ pageNumber: '1' }]),
  'queryParams':  Observable.from([{ subject: ['English'] }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionHeaderComponent ],
      imports: [SharedModule, CoreModule],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute },
        CourseConsumptionService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
