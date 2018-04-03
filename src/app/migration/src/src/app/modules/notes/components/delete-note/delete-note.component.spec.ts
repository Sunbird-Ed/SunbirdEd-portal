import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services';
import { UserService, ContentService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Ng2IziToastModule } from 'ng2-izitoast';
import * as mockData from './delete-note-component.spec.data';
import { DeleteNoteComponent } from './delete-note.component';
const testData = mockData.mockRes;

describe('DeleteNoteComponent', () => {
  let component: DeleteNoteComponent;
  let fixture: ComponentFixture<DeleteNoteComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModule, HttpClientTestingModule, Ng2IziToastModule, FormsModule ],
      declarations: [ DeleteNoteComponent ],
      providers: [ UserService, ResourceService, ToasterService, NotesService,
        ConfigService, LearnerService, ContentService, { provide: Router, useClass: RouterStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.DeleteNote = testData.userSuccess.result.response.note[0];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to note service while deleting a note', () => {
    const noteService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(noteService, 'remove').and.returnValue(Observable.of(testData.deleteSuccess));
    component.removeNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should get error response', () => {
    const noteService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(noteService, 'remove').and.returnValue(Observable.of(testData.deleteFailed));
    component.removeNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });

  it('Should throw error from else statement', () => {
    const noteService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(learnerService, 'get').and.returnValue(Observable.of(testData.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(noteService, 'remove').and.callFake(() => Observable.throw(testData.deleteFailed));
    component.removeNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
});
