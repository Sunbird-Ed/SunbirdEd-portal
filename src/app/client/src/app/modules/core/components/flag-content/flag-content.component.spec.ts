import { ContentService, PlayerService, UserService, LearnerService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlagContentComponent } from './flag-content.component';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from './flag-content.component.spec.data';
describe('FlagContentComponent', () => {
  let component: FlagContentComponent;
  let fixture: ComponentFixture<FlagContentComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0050': 'nnnn'}
    }
  };

const fakeActivatedRoute = { parent: { params: Observable.of({contentId: 'testId', contentName: 'hello'}) }};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [ FlagContentComponent ],
      providers: [ContentService, PlayerService, UserService, LearnerService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get content', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.contentData = Response.successContentData.result.content;
    component.getContentData();
    expect(component.contentData).toBeDefined();
  });
  it('should call getContent api when data is not present ', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.contentData = {};
    spyOn(playerService, 'getContent').and.callFake(() => Observable.of(Response.successContentData));
    component.getContentData();
    expect(component.contentData).toBeDefined();
  });
  it('should subscribe to user service', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess));
    userService.getUserProfile();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.userData).toBeDefined();
  });
});
