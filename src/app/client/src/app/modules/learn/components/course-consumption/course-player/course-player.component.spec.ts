import { CourseProgressService } from './../../../services/courseProgress/course-progress.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { INoteData } from '@sunbird/notes';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoursePlayerComponent } from './course-player.component';
import { SharedModule } from '@sunbird/shared';
import {} from 'jasmine';
import { CourseConsumptionService } from '../../../services';

describe('CoursePlayerComponent', () => {
  let component: CoursePlayerComponent;
  let fixture: ComponentFixture<CoursePlayerComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const fakeActivatedRoute = {
    'params' : {children: [{courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160'}],
     'first': () => {
       return Observable.of([{courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160'}]);
      } }
  };

  const mockNote: INoteData = {
    note: 'Mock',
    userId: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
    title: 'Mock',
    courseId: 'do_212282810437918720179',
    contentId: 'do_2123475531394826241107',
    createdBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
    updatedBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
    createdDate: '2018-03-12 08:19:53:937+0000',
    updatedDate: '2018-03-12 08:25:53:937+0000'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePlayerComponent ],
      providers: [ CourseConsumptionService, CourseProgressService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
     ],
      imports: [ SharedModule, CoreModule, HttpClientTestingModule ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update createNoteData on recieving a note data from createEventEmitter', () => {
    component.createEventEmitter(mockNote);
    expect(component.createNoteData).toEqual(mockNote);
  });
});
