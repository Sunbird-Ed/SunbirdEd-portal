import { IdDetails } from './../../interfaces/notes';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { response } from './inline-editor-component.spec.data';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
import { InlineEditorComponent } from './inline-editor.component';

describe('InlineEditorComponent', () => {
  let component: InlineEditorComponent;
  let fixture: ComponentFixture<InlineEditorComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [InlineEditorComponent],
      providers: [NotesService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditorComponent);
    component = fixture.componentInstance;
    const idInfo: IdDetails = { courseId: 'do_212347136096788480178', contentId: 'do_112498388508524544160'};
    component.ids = idInfo;
    spyOn(component, 'ngAfterViewInit');
    fixture.detectChanges();
  });


  it('Should make create API call while creating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(component.createEventEmitter, 'emit');
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    spyOn(notesService, 'create').and.returnValue(Observable.of(response.successResponse));
    userService.getUserProfile();
    component.createNote();
    expect(component.showLoader).toBeFalsy();
    expect(component.createEventEmitter.emit).toHaveBeenCalled();
  });

  it('Should throw error from API response - create API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw({}));
    spyOn(notesService, 'create').and.callFake(() => Observable.throw(response.errResponse));
    userService.getUserProfile();
    component.createNote();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0030);
  });

  it('Should make update API call while updating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(component.updateEventEmitter, 'emit');
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(response.searchSuccess));
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    spyOn(notesService, 'update').and.returnValue(Observable.of(response.successResponse));
    userService.getUserProfile();
    component.updateNote();
    expect(component.showLoader).toBeFalsy();
    expect(component.updateEventEmitter.emit).toHaveBeenCalled();
  });

  it('Should throw error from API response - update API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(notesService, 'search').and.callFake(() => Observable.throw(response.searchSuccess));
    spyOn(learnerService, 'get').and.callFake(() => Observable.throw({}));
    spyOn(notesService, 'update').and.callFake(() => Observable.throw(response.errResponse));
    userService.getUserProfile();
    component.updateNote();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0034);
  });

  it('Should clear values from title and description', () => {
    component.clearNote();
    expect(component.noteData.title).toBe('');
    expect(component.noteData.note).toBe('');
  });

});
