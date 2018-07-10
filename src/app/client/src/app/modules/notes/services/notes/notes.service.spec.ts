
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { response } from './notes-service.spec.data';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotesService } from './notes.service';
import { UserService, LearnerService, CoreModule } from '@sunbird/core';

describe('NotesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
      providers: [NotesService, LearnerService, UserService]
    });
  });


  it('Should make search API call', () => {
    const learnerService = TestBed.get(LearnerService);
    const service = TestBed.get(NotesService);
    const param = { request: { userid: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e', courseid: 'do_2123229899264573441612' } };
    spyOn(learnerService, 'post').and.callFake(() => observableOf(response.userSuccess));
    const apiRes = service.search(param);
    expect(learnerService.post).toHaveBeenCalled();
  });

  it('Should make create API call', () => {
    const learnerService = TestBed.get(LearnerService);
    const service = TestBed.get(NotesService);
    const param = {
      request: {
        note: 'Mock note',
        userId: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        title: 'Mock',
        courseId: 'do_212282810437918720179',
        contentId: 'do_2123475531394826241107',
        createdBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        updatedBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        createdDate: {},
        updatedDate: {},
        id: {}
      }
    };
    spyOn(learnerService, 'post').and.callFake(() => observableOf(response.userSuccess));
    service.create(param);
    expect(learnerService.post).toHaveBeenCalled();
  });

  it('Should make update API call', () => {
    const learnerService = TestBed.get(LearnerService);
    const service = TestBed.get(NotesService);
    const param = {
    noteId: '/012455264743841792211',
    request: {
      note: 'Mock note',
      title: 'Mock',
      updatedBy: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
      updatedDate: 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
    } };
    spyOn(learnerService, 'patch').and.callFake(() => observableOf(response.userSuccess));
    const apiRes = service.update(param);
    expect(learnerService.patch).toHaveBeenCalled();
  });

  it('Should make remove API call', () => {
    const learnerService = TestBed.get(LearnerService);
    const service = TestBed.get(NotesService);
    const param = { noteId: '012455264743841792211' };
    spyOn(learnerService, 'delete').and.callFake(() => observableOf(response.userSuccess));
    const apiRes = service.remove(param);
    expect(learnerService.delete).toHaveBeenCalled();
  });
});
