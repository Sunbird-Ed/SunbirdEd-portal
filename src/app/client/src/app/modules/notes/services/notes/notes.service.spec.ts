
import {of as observableOf } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { response } from './notes-service.spec.data';
import { SharedModule } from '@sunbird/shared';
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
    spyOn(learnerService, 'post').and.callFake(() => observableOf(response.userSuccess));
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
    spyOn(learnerService, 'patch').and.callFake(() => observableOf(response.userSuccess));
    expect(learnerService.patch).toHaveBeenCalled();
  });

  it('Should make remove API call', () => {
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'delete').and.callFake(() => observableOf(response.userSuccess));
    expect(learnerService.delete).toHaveBeenCalled();
  });
});
