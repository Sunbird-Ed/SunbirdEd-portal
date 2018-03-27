import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NoteFormComponent } from './../note-form/note-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, ConfigService, FilterPipe } from '@sunbird/shared';
import { NotesService } from '../../services/index';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, ContentService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import * as mockData from '../note-list/note-list-component.spec.data';
import { SuiComponentFactory } from 'ng2-semantic-ui/dist';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NoteCardComponent } from './note-card.component';
import { TimeAgoPipe } from 'time-ago-pipe';
const testData = mockData.mockRes;

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'mode': 'create' }]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ OrderModule, HttpClientTestingModule, Ng2IziToastModule ],
      declarations: [ NoteCardComponent, NoteFormComponent, FilterPipe, TimeAgoPipe ],
      providers: [ UserService, ResourceService, ToasterService, NotesService, LearnerService,
         ConfigService, ContentService, SuiModalService, SuiComponentFactory,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to note service while collecting existing notes', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const noteService = TestBed.get(NotesService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(noteService, 'search').and.returnValue(Observable.of(testData.responseSuccess));
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
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(testData.responseFailed));
    component.getAllNotes();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

});
