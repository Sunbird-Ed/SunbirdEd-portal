import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, WindowScrollService, ToasterService } from '@sunbird/shared';
import { ReviewCommentsComponent } from './review-comments.component';
import { CoreModule, UserService, PermissionService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReviewCommentsService } from '../../services';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { FormControl } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';

const mockUserService = {
  userProfile: {
    userId: 'hhhhh',
    firstName: 'an',
    lastName: 'pp'
  }
};
const contentData = {
  identifier: 'do_112618242554707968193',
  pkgVersion: '2',
  mimeType: 'application/vnd.ekstep.ecml-archive',
  body: 'body',
  contentType: 'contentType',
  versionKey: 'versionKey',
  status: 'Live',
  me_averageRating: '4',
  description: 'ffgg',
  name: 'ffgh',
  concepts: ['AI', 'ML'],
  code: 'code',
  framework: 'framework',
  userId: 'userid',
  userName: 'userName'
};
const mockResourceBundle = {
  'messages': {
    'emsg': {
      'm0005': 'No content to play'
    }
  }
};

const commentList = {
  'responseCode': 'OK',
  'result': {
    'comments': [
      {
        'postId': '5bda3011-d871-11e8-a6ec-bdcab632f44c',
        'body': 'ttegeggb',
        'createdOn': '2018-10-25T16:16:41.879Z',
        'isDeleted': false,
        'tag': 'do_112618242554707968193_2_application/vnd.ekstep.ecml-archive',
        'threadId': '5bda3010-d871-11e8-a6ec-bdcab632f44c',
        'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69',
        'userInfo': {
          'name': 'contentreviewer_org_001_002'
        },
        'stageId': 'e845acd2-dd5c-41e9-aa44-a2033c819e45'
      },
      {
        'postId': '55eefd71-d871-11e8-a6ec-bdcab632f44c',
        'body': 'ggggg',
        'createdOn': '2018-10-25T16:16:31.947Z',
        'isDeleted': false,
        'tag': 'do_112618242554707968193_2_application/vnd.ekstep.ecml-archive',
        'threadId': '55eefd70-d871-11e8-a6ec-bdcab632f44c',
        'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69',
        'userInfo': {
          'name': 'contentreviewer_org_001_002'
        },
        'stageId': '1e4d73e5-7c21-4436-929a-8a41c2c5509e'
      },
      {
        'postId': 'c037e191-d86e-11e8-a6ec-bdcab632f44c',
        'body': 'ffff',
        'createdOn': '2018-10-25T15:58:01.910Z',
        'isDeleted': false,
        'tag': 'do_112618242554707968193_2_application/vnd.ekstep.ecml-archive',
        'threadId': 'c037e190-d86e-11e8-a6ec-bdcab632f44c',
        'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69',
        'userInfo': {
          'name': 'contentreviewer_org_001_002'
        },
        'stageId': 'b7387200-811a-47de-868a-0113498e8111'
      },
      {
        'postId': '500be120-d871-11e8-a6ec-bdcab632f44c',
        'body': 'testd ',
        'createdOn': '2018-10-25T16:16:22.071Z',
        'isDeleted': false,
        'tag': 'do_112618242554707968193_2_application/vnd.ekstep.ecml-archive',
        'threadId': 'c037e190-d86e-11e8-a6ec-bdcab632f44c',
        'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69',
        'userInfo': {
          'name': 'contentreviewer_org_001_002'
        },
        'stageId': 'b7387200-811a-47de-868a-0113498e8111'
      }
    ]
  }
};

describe('ReviewCommentsComponent', () => {
  let component: ReviewCommentsComponent;
  let fixture: ComponentFixture<ReviewCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCommentsComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ReviewCommentsService,
        { provide: ResourceService, useValue: mockResourceBundle },
        { provide: UserService, useValue: mockUserService },
      ],
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule,
        TelemetryModule.forRoot(), OrderModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCommentsComponent);
    component = fixture.componentInstance;
  });

  it('should fetch comments list on ngOnInit and sort it if api returns data', () => {
    const userService = TestBed.get(UserService);
    const resourceService = TestBed.get(ResourceService);
    const reviewCommentsService = TestBed.get(ReviewCommentsService);
    component.contentData = contentData;
    spyOn(reviewCommentsService, 'getComments').and.returnValue(of(commentList));
    component.ngOnInit();
    expect(component.sortedComments).toBeDefined();
    expect(component.stageId).toBeUndefined();
  });

  it('should fetch comments list on ngOnInit and throw error if api fails', () => {
    const reviewCommentsService = TestBed.get(ReviewCommentsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'true');
    component.contentData = contentData;
    spyOn(reviewCommentsService, 'getComments').and.returnValue(throwError(commentList));
    component.ngOnInit();
    expect(_.isEmpty(component.sortedComments)).toBeTruthy();
    expect(component.stageId).toBeUndefined();
    expect(component.toasterService.error).toHaveBeenCalled();
  });

  it('should make create comment api and save data if api returns success', () => {
    const reviewCommentsService = TestBed.get(ReviewCommentsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'true');
    component.contentData = contentData;
    component.stageId = 'hhhh';
    component.comments = new FormControl();
    // component.comments = { value: 'data', setValue: () = {}};
    component.comments.setValue('data');
    spyOn(reviewCommentsService, 'createComment').and.returnValue(of(commentList));
    component.addReviewComments();
    expect(_.isEmpty(component.sortedComments)).toBeFalsy();
  });

  it('should make create comment api and throw error if api fails', () => {
    const reviewCommentsService = TestBed.get(ReviewCommentsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'true');
    component.contentData = contentData;
    component.stageId = 'hhhh';
    component.comments = new FormControl();
    component.comments.setValue('data');
    spyOn(reviewCommentsService, 'createComment').and.returnValue(throwError(commentList));
    component.addReviewComments();
    expect(_.isEmpty(component.sortedComments)).toBeTruthy();
    expect(component.toasterService.error).toHaveBeenCalled();
  });

  it('should not make create comment api call if stageId is not present', () => {
    const reviewCommentsService = TestBed.get(ReviewCommentsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => 'true');
    component.contentData = contentData;
    spyOn(reviewCommentsService, 'createComment').and.returnValue(throwError(commentList));
    component.addReviewComments();
    expect(_.isEmpty(component.sortedComments)).toBeTruthy();
    expect(component.toasterService.error).toHaveBeenCalled();
  });

});
