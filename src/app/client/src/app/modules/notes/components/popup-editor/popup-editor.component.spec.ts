
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { IdDetails } from './../../interfaces/notes';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { Router } from '@angular/router';
import { NotesService } from '../../services';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { response } from './popup-editor-component.spec.data';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
import { PopupEditorComponent } from './popup-editor.component';

describe('PopupEditorComponent', () => {
  let component: PopupEditorComponent;
  let fixture: ComponentFixture<PopupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [PopupEditorComponent],
      providers: [NotesService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupEditorComponent);
    component = fixture.componentInstance;
    const idInfo: IdDetails = { courseId: 'do_212347136096788480178', contentId: 'do_112498388508524544160'};
    component.ids = idInfo;
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
    userService.getUserProfile();
    spyOn(notesService, 'create').and.returnValue(observableOf(response.successResponse));
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
    userService.getUserProfile();
    spyOn(notesService, 'create').and.callFake(() => observableThrowError(response.errResponse));
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
    component.updateData = response.selectedNote;
    spyOn(component.updateEventEmitter, 'emit');
    spyOn(notesService, 'search').and.callFake(() => observableThrowError(response.searchSuccess));
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockUserData.success));
    userService.getUserProfile();
    spyOn(notesService, 'update').and.returnValue(observableOf(response.successResponse));
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
    component.updateData = response.selectedNote;
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(notesService, 'search').and.callFake(() => observableThrowError(response.searchSuccess));
    spyOn(learnerService, 'get').and.callFake(() => observableThrowError({}));
    userService.getUserProfile();
    spyOn(notesService, 'update').and.callFake(() => observableThrowError(response.errResponse));
    component.updateNote();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0034);
  });

  it('Should clear values from title and description', () => {
    component.clearNote();
    expect(component.noteData.title).toBe('');
    expect(component.noteData.note).toBe('');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.updateData = response.selectedNote;
    component.createNote();
    component.updateNote();
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
