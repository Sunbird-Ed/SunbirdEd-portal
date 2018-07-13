
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { IdDetails } from '@sunbird/notes';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { NotesService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { SuiModal } from 'ng2-semantic-ui';
import { response } from './note-card-component.spec.data';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
import { NoteCardComponent } from './note-card.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import * as _ from 'lodash';

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;

  class ActivatedRouteStub {
    snapshot = { queryParams : {contentId : 'do_112270494168555520130'}};
    paramsMock = {courseId: 'do_212347136096788480178', batchId: '01250892550857523234', contentId: 'do_112498388508524544160'};
    queryParamsMock = {contentId: 'do_112270494168555520130'};
    queryParams =  observableOf(this.queryParamsMock);
    params =  observableOf(this.paramsMock);
    public changeParams(params) {
      this.paramsMock = params;
    }
    public changeSnapshot(snapshot) {
      this.snapshot = snapshot;
    }
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ OrderModule, HttpClientTestingModule, SharedModule.forRoot(), CoreModule.forRoot() ],
      declarations: [ NoteCardComponent, TimeAgoPipe ],
      providers: [ NotesService,
         { provide: Router, useClass: RouterStub },
         { provide: ActivatedRoute, useClass: ActivatedRouteStub } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(NoteCardComponent);
      component = fixture.componentInstance;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCardComponent);
    component = fixture.componentInstance;
    const idInfo: IdDetails = { courseId: 'do_212347136096788480178', contentId: 'do_112498388508524544160'};
    component.ids = idInfo;
  });

  it('Should make search API call while collecting existing notes', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const noteService = TestBed.get(NotesService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockUserData.success));
    spyOn(noteService, 'search').and.returnValue(observableOf(response.responseSuccess));
    userService.getUserProfile();
    component.getAllNotes();
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
    spyOn(learnerService, 'get').and.callFake(() => observableThrowError({}));
    spyOn(notesService, 'search').and.callFake(() => observableThrowError(response.responseFailed));
    userService.getUserProfile();
    component.getAllNotes();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('Should refresh the values of selectedIndex and selectedNote once a note is updated', () => {
    component.notesList = response.responseSuccess.result.response.note;
    component.updateEventEmitter(response.responseSuccess.result.response.note[0]);
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(component.notesList[0]);
    expect(component.showUpdateEditor).toBeFalsy();
  });

  it('Should update notesList value if createNoteData and notesList is available', () => {
    component.notesList = response.responseSuccess.result.response.note;
    component.createNoteData = response.testNote;
    component.ngOnChanges();
    expect(component.notesList[0]).toBe(response.testNote);
  });

  it('Should not update notesList value if createNoteData is unavailable and notesList is available', () => {
    component.notesList = response.responseSuccess.result.response.note;
    component.ngOnChanges();
    expect(component.notesList).toBe(response.responseSuccess.result.response.note);
  });

  it('Should not update notesList value if createNoteData and notesList is unavailable', () => {
    component.ngOnChanges();
    expect(component.notesList).toBeUndefined();
  });

  it('Should not update notesList value if notesList is unavailable and  createNoteData is available', () => {
    component.createNoteData = response.testNote;
    component.ngOnChanges();
    expect(component.notesList[0]).toBe(component.createNoteData);
  });

  it('Should redirect to notes list component when batchId and contentId(from queryParams) is available', () => {
    const route = TestBed.get(Router);
    component.viewAllNotes();
    expect(route.navigate).toHaveBeenCalledWith(['/learn/course', 'do_212347136096788480178', 'batch', '01250892550857523234',
     'notes', 'do_112270494168555520130']);
  });

  it('Should redirect to notes list component when the only parameter available is batchId', () => {
    const route = TestBed.get(Router);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.changeSnapshot(undefined);
    component.viewAllNotes();
    expect(route.navigate).toHaveBeenCalledWith(['/learn/course', 'do_212347136096788480178', 'batch', '01250892550857523234', 'notes']);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.getAllNotes();
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
