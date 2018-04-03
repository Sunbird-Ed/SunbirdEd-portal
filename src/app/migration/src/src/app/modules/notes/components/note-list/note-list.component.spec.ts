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
import * as mockData from './note-list-component.spec.data';
import { NoteListComponent } from './note-list.component';
import { SuiComponentFactory } from 'ng2-semantic-ui/dist';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { TimeAgoPipe } from 'time-ago-pipe';
const testData = mockData.mockRes;

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

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to note service while collecting existing notes', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'search').and.returnValue(Observable.of(testData.responseSuccess));
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
