import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NoteFormComponent } from './../note-form/note-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, ConfigService, FilterPipe } from '@sunbird/shared';
import { NotesService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, ContentService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { response } from './note-list-component.spec.data';
import { NoteListComponent } from './note-list.component';
import { SuiComponentFactory } from 'ng2-semantic-ui/dist';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { TimeAgoPipe } from 'time-ago-pipe';

describe('NoteListComponent', () => {
  let component: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'mode': 'create' }]) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ OrderModule, HttpClientTestingModule, Ng2IziToastModule ],
      declarations: [ NoteListComponent, NoteFormComponent, FilterPipe, TimeAgoPipe ],
      providers: [ UserService, ResourceService, ToasterService, NotesService, LearnerService,
         ConfigService, ContentService, SuiModalService, SuiComponentFactory,
          { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(NoteListComponent);
      component = fixture.componentInstance;
    });
  }));


  it('Should subscribe to note service while collecting existing notes', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'search').and.returnValue(Observable.of(response.responseSuccess));
    component.getAllNotes();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.notesList).toBeDefined();
  });

  it('Should throw error from else statement', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(response.responseFailed));
    component.getAllNotes();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should assign values to selectedIndex and selectedNote', () => {
    component.showNoteList(response.userSuccess.result.response.note[0], 0);
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(response.userSuccess.result.response.note[0]);

  });

  it('Should refresh the values of selectedIndex and selectedNote once a note is deleted', () => {
    component.notesList = response.userSuccess.result.response.note;
    component.finalNotesListData('01245874638382694454');
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedNote).toBe(component.notesList[0]);

  });


});
