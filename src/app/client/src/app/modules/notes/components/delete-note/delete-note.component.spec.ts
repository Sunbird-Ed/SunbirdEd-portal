import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, ConfigService, FilterPipe } from '@sunbird/shared';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services';
import { UserService, ContentService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { response } from './delete-note-component.spec.data';
import { DeleteNoteComponent } from './delete-note.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DeleteNoteComponent', () => {
  let component: DeleteNoteComponent;
  let fixture: ComponentFixture<DeleteNoteComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, FormsModule],
      declarations: [DeleteNoteComponent],
      providers: [UserService, ResourceService, ToasterService, NotesService,
        ConfigService, LearnerService, { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.deleteNote = response.note;
  });

  it('Should make remove api call and get success response', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    spyOn(component.deleteEventEmitter, 'emit');
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'remove').and.returnValue(Observable.of(response.deleteSuccess));
    component.removeNote();
    component.deleteEventEmitter.emit('01245874638382694454');
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.deleteEventEmitter.emit).toHaveBeenCalled();
  });

  it('Should make remove api call and get error response', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(learnerService, 'get').and.returnValue(Observable.of(response.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    spyOn(notesService, 'remove').and.callFake(() => Observable.throw(response.deleteFailed));
    component.removeNote();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalled();
  });
});
