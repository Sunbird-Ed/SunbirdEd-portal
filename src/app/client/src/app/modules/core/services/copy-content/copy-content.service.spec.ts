import { TestBed, inject } from '@angular/core/testing';

import { CopyContentService } from './copy-content.service';
import { SharedModule, ContentData, IUserProfile } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
  // events = Observable.from([{id: 1, url: '/resources', urlAfterRedirects:  '/resources'},
  // {id: 1, url: '/home', urlAfterRedirects:  '/home'}]);
}

const contentData = {
  'template code': 'org.ekstep.ordinal.story', 'keywords': ['elephant'], 'methods': [], 'code': 'code', 'framework': 'NCF',
  'description': 'Elephant and the Monkey', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive',
  'body': '{}', 'createdOn': '2016-03-28T09:13:19.470+0000', 'appIcon': '', 'gradeLevel': ['Grade 1', 'Grade 2'],
  'collections': [], 'children': [], 'usesContent': [], 'artifactUrl': '', 'lastUpdatedOn': '',
  'contentType': 'Story', 'item_sets': [], 'owner': 'EkStep', 'identifier': 'domain_14302',
  'audience': ['Learner'], 'visibility': 'Default', 'libraries': [], 'mediaType': 'content',
  'ageGroup': ['6-7', '8-10'], 'osId': 'org.ekstep.quiz.app', 'languageCode': 'en', 'userId': 's', 'userName': 'sourav',
  'versionKey': '1497009185536', 'tags': ['elephant'], 'concepts': [], 'createdBy': 'EkStep',
  'name': 'Elephant and the Monkey', 'me_averageRating': 'd', 'publisher': 'EkStep', 'usedByContent': [], 'status': 'Live', 'path': ''
};



describe('CopyContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [CopyContentService, UserService, { provide: Router, useClass: RouterStub }]
    });
  });

  fit('should call format data', inject([CopyContentService, UserService], (service: CopyContentService, user: UserService) => {
    const response = service.formatData(contentData);
    const userData = user.userProfile();
  }));


});
