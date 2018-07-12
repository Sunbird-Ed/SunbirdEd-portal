
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { IdDetails } from './../../interfaces/notes';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
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
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'success').and.callThrough();
    spyOn(component.createEventEmitter, 'emit');
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockUserData.success));
    spyOn(notesService, 'create').and.returnValue(observableOf(response.successResponse));
    userService.getUserProfile();
    component.createNote();
    expect(component.createEventEmitter.emit).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0009);
  });

  it('Should throw error from API response - create API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(learnerService, 'get').and.callFake(() => observableThrowError({}));
    spyOn(notesService, 'create').and.callFake(() => observableThrowError(response.errResponse));
    userService.getUserProfile();
    component.createNote();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0030);
  });

  it('Should make update API call while updating a note', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'success').and.callThrough();
    spyOn(component.updateEventEmitter, 'emit');
    spyOn(notesService, 'search').and.callFake(() => observableThrowError(response.searchSuccess));
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockUserData.success));
    spyOn(notesService, 'update').and.returnValue(observableOf(response.successResponse));
    userService.getUserProfile();
    component.updateNote();
    expect(component.updateEventEmitter.emit).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0013);
  });

  it('Should throw error from API response - update API', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(notesService, 'search').and.callFake(() => observableThrowError(response.searchSuccess));
    spyOn(learnerService, 'get').and.callFake(() => observableThrowError({}));
    spyOn(notesService, 'update').and.callFake(() => observableThrowError(response.errResponse));
    userService.getUserProfile();
    component.updateNote();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0034);
  });

  it('Should clear values from title and description', () => {
    component.clearNote();
    expect(component.noteData.title).toBe('');
    expect(component.noteData.note).toBe('');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    component.createNote();
    component.updateNote();
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
