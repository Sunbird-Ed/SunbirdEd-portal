import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/index';
import { UserService, ContentService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Ng2IziToastModule } from 'ng2-izitoast';
import * as mockData from './note-form-component.spec.data';
import { NoteFormComponent } from './note-form.component';
const testData = mockData.mockRes;

describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let fixture: ComponentFixture<NoteFormComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ 'mode': 'create' }]),
    'parent': { 'params': Observable.from([{ 'mode': 'create' }]) }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, FormsModule],
      declarations: [NoteFormComponent],
      providers: [UserService, ResourceService, ToasterService, NotesService,
        ConfigService, LearnerService, ContentService,
         { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFormComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngAfterViewInit');
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to note service while creating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'create').and.returnValue(Observable.of(testData.successResponse));
    component.createNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should throw error from else - create API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'create').and.returnValue(Observable.of(testData.errResponse));
    component.createNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should throw error from API response - create API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'create').and.callFake(() => Observable.throw(testData.errResponse));
    component.createNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should subscribe to note service while updating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'update').and.returnValue(Observable.of(testData.successResponse));
    component.updateNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.notesList).toBeDefined();
  });

  it('Should throw error from else - update API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'update').and.returnValue(Observable.of(testData.errResponse));
    component.updateNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should throw error from API response - update API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userError));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'update').and.callFake(() => Observable.throw(testData.errResponse));
    component.updateNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should clear values from title and description', () => {
    component.clearNote();
    expect(component.noteData.title).toBe('');
    expect(component.noteData.note).toBe('');
  });

  it('should call redirect', () => {
    const route = TestBed.get(Router);
    component.redirect();
    fixture.detectChanges();
    expect(component).toBeDefined();
  });
});
