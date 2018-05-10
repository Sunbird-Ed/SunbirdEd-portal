import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NoteFormComponent } from './../note-form/note-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { NotesService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { SuiModal } from 'ng2-semantic-ui';
import { response } from './note-card-component.spec.data';
import { NoteCardComponent } from './note-card.component';
import { TimeAgoPipe } from 'time-ago-pipe';

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'courseId': 'do_212347136096788480178',
   'contentId': 'do_2123229899264573441612' }]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ OrderModule, HttpClientTestingModule, SharedModule, CoreModule ],
      declarations: [ NoteCardComponent, TimeAgoPipe ],
      providers: [ UserService, ResourceService, ToasterService, NotesService, LearnerService,
         { provide: ActivatedRoute, useValue: fakeActivatedRoute },
         { provide: Router, useClass: RouterStub } ],
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
    fixture.detectChanges();
  });

  it('Should subscribe to note service while collecting existing notes', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const noteService = TestBed.get(NotesService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userSuccess));
    spyOn(noteService, 'search').and.returnValue(Observable.of(response.responseSuccess));
    userService.getUserProfile();
    component.getAllNotes();
    fixture.detectChanges();
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
    userService.getUserProfile();
    component.getAllNotes();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalled();
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
});
