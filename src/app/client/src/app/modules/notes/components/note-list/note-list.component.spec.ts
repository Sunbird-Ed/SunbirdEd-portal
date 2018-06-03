import { IdDetails } from './../../interfaces/notes';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { NotesService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { response } from './note-list-component.spec.data';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
import { NoteListComponent } from './note-list.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';

describe('NoteListComponent', () => {
  let component: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': Observable.from([{ courseId: 'do_212347136096788480178', contentId: 'do_112498388508524544160' }]),
    snapshot: {
      data: {
        telemetry: {
          env: 'library', pageid: 'content-note-read', type: 'list',
          object: { type: 'library', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderModule, SharedModule, CoreModule,
        TelemetryModule, NgInviewModule],
      declarations: [NoteListComponent, TimeAgoPipe],
      providers: [NotesService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NoteListComponent);
        component = fixture.componentInstance;
        const idInfo: IdDetails = { courseId: 'do_212347136096788480178', contentId: 'do_112498388508524544160' };
        component.ids = idInfo;
      });
  }));


  it('Should make search API call while collecting existing notes', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    spyOn(notesService, 'search').and.returnValue(Observable.of(response.responseSuccess));
    component.courseId = 'do_212347136096788480178';
    component.contentId = 'do_112498388508524544160';
    userService.getUserProfile();
    component.getAllNotes();
    expect(component.showLoader).toBeFalsy();
    expect(component.notesList).toBeDefined();
  });

  it('Should display error message in case of exception in fetching list of notes', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw({}));
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(response.responseFailed));
    component.courseId = 'do_212347136096788480178';
    component.contentId = 'do_112498388508524544160';
    userService.getUserProfile();
    component.getAllNotes();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('Should assign values to selectedIndex and selectedNote', () => {
    component.setSelectedNote(response.responseSuccess.result.response.note[0], 0);
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(response.responseSuccess.result.response.note[0]);

  });

  it('Should refresh the values of selectedIndex and selectedNote once a note is deleted', () => {
    component.notesList = response.responseSuccess.result.response.note;
    component.deleteEventEmitter('01245874638382694454');
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(component.notesList[0]);

  });

  it('Should refresh the values of selectedIndex and selectedNote once a note is created', () => {
    component.notesList = response.responseSuccess.result.response.note;
    component.createEventEmitter(response.responseSuccess.result.response.note[0]);
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(component.notesList[0]);
    expect(component.showCreateEditor).toBeFalsy();
  });

  it('Should refresh the values of selectedIndex and selectedNote once a note is updated', () => {
    component.notesList = response.responseSuccess.result.response.note;
    component.updateEventEmitter(response.responseSuccess.result.response.note[0]);
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(component.notesList[0]);
    expect(component.showUpdateEditor).toBeFalsy();
  });
  it('should call inview method for visits data', () => {
    component.telemetryImpression = response.telemetryData;
    spyOn(component, 'inview').and.callThrough();
    component.inview(response.event.inview);
    expect(component.inview).toHaveBeenCalled();
    expect(component.inviewLogs).toBeDefined();
  });
});
