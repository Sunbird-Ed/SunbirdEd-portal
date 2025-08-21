import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBankListComponent } from './question-bank-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, UserService } from '@sunbird/core';
import { 
  PaginationService, ConfigService, ToasterService, 
  ResourceService, NavigationHelperService 
} from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { SuiModalService } from 'ng2-semantic-ui-v9';
import { of } from 'rxjs';

describe('QuestionBankListComponent', () => {
  let component: QuestionBankListComponent;
  let fixture: ComponentFixture<QuestionBankListComponent>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockWorkSpaceService: jasmine.SpyObj<WorkSpaceService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockToasterService: jasmine.SpyObj<ToasterService>;
  let mockResourceService: jasmine.SpyObj<ResourceService>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;
  let mockPaginationService: jasmine.SpyObj<PaginationService>;
  let mockNavigationHelperService: jasmine.SpyObj<NavigationHelperService>;
  let mockModalService: jasmine.SpyObj<SuiModalService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj('SearchService', ['compositeSearch']);
    mockWorkSpaceService = jasmine.createSpyObj('WorkSpaceService', ['deleteContent', 'navigateToContent']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserId']);
    mockToasterService = jasmine.createSpyObj('ToasterService', ['success', 'error']);
    mockResourceService = jasmine.createSpyObj('ResourceService', [], {
      messages: {
        fmsg: { m0004: 'Error message', m0022: 'Delete error', m0008: 'Copy error' },
        smsg: { m0006: 'Delete success', m0042: 'Copy success' },
        stmsg: { m0130: 'Live', m0131: 'No question banks', m0132: 'Try adjusting' }
      },
      frmelmnts: {
        lbl: { questionBanks: 'Question Banks', results: 'results' },
        btn: { view: 'View', copy: 'Copy', delete: 'Delete', cancel: 'Cancel' }
      }
    });
    mockConfigService = jasmine.createSpyObj('ConfigService', [], {
      appConfig: {
        WORKSPACE: { PAGE_LIMIT: 10 }
      }
    });
    mockPaginationService = jasmine.createSpyObj('PaginationService', ['getPager']);
    mockNavigationHelperService = jasmine.createSpyObj('NavigationHelperService', ['getPageLoadTime']);
    mockModalService = jasmine.createSpyObj('SuiModalService', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      params: of({ pageNumber: 1 }),
      queryParams: of({}),
      snapshot: {
        data: {
          telemetry: {
            env: 'workspace',
            type: 'list',
            pageid: 'workspace-content-question-banks',
            uri: '/workspace/content/question-banks',
            subtype: 'paginate'
          }
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [QuestionBankListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: WorkSpaceService, useValue: mockWorkSpaceService },
        { provide: UserService, useValue: mockUserService },
        { provide: ToasterService, useValue: mockToasterService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: NavigationHelperService, useValue: mockNavigationHelperService },
        { provide: SuiModalService, useValue: mockModalService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBankListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.questionBanks).toEqual([]);
    expect(component.showLoader).toBe(true);
    expect(component.noResult).toBe(false);
    expect(component.pageNumber).toBe(1);
    expect(component.state).toBe('questionbank');
  });

  it('should fetch question banks on init', () => {
    const mockResponse = {
      result: {
        count: 5,
        content: [
          { identifier: '1', name: 'Test Question Bank 1', contentType: 'QuestionSet' },
          { identifier: '2', name: 'Test Question Bank 2', contentType: 'QuestionSet' }
        ]
      }
    };

    mockSearchService.compositeSearch.and.returnValue(of(mockResponse));
    mockPaginationService.getPager.and.returnValue({
      currentPage: 1,
      totalPages: 1,
      pages: [1]
    });

    component.ngOnInit();

    expect(mockSearchService.compositeSearch).toHaveBeenCalled();
    expect(component.questionBanks.length).toBe(2);
    expect(component.totalCount).toBe(5);
  });

  it('should navigate to correct page', () => {
    component.paginationDetails = {
      currentPage: 1,
      totalPages: 3,
      pages: [1, 2, 3]
    };

    component.navigateToPage(2);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['workspace/content/question-banks', 2]);
  });

  it('should not navigate to invalid page', () => {
    component.paginationDetails = {
      currentPage: 1,
      totalPages: 3,
      pages: [1, 2, 3]
    };

    component.navigateToPage(0);
    component.navigateToPage(4);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle content click', () => {
    const mockContent = { identifier: '1', name: 'Test Question Bank' };

    component.contentClick(mockContent);

    expect(mockWorkSpaceService.navigateToContent).toHaveBeenCalledWith(mockContent, 'questionbank');
  });

  it('should handle copy content', () => {
    const mockContent = { identifier: '1', name: 'Test Question Bank' };

    component.copyContent(mockContent);

    expect(mockToasterService.success).toHaveBeenCalled();
    expect(component.showLoader).toBe(false);
  });

  it('should set interact event data', () => {
    const result = component.setInteractEventData('test-id');

    expect(result).toEqual({
      context: {
        cdata: [],
        env: 'workspace'
      },
      edata: {
        id: 'test-id',
        type: 'click',
        pageid: 'workspace-content-question-banks'
      }
    });
  });
});
