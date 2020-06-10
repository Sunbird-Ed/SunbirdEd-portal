import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ResourceService, ToasterService, SharedModule, ConfigService,
  UtilService, BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { CbseProgramService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { AppLoaderComponent } from '../../../shared/components/app-loader/app-loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { sessionContext, sampleTextbook, textbookList,
  programContext } from './dashboard.component.spec.data';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
    // tslint:disable-next-line:prefer-const
  let errorInitiate;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(sampleTextbook);
      }
    }
  };

  const ContentServiceStub = {
    post() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(textbookList);
      }
    }
  };
  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {
        dialCode: 'D4R4K4'
      },
      data: {
        telemetry: { env: 'programs'}
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, CoreModule, SharedModule.forRoot(),
        SuiTabsModule, FormsModule, HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ DashboardComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [ConfigService, UtilService, ToasterService,
        CbseProgramService, TelemetryService, ResourceService,
        CacheService, BrowserCacheTtlService, NavigationHelperService,
        // tslint:disable-next-line:max-line-length
        { provide: ContentService, useValue: ContentServiceStub },
        { provide: ActionService, useValue: actionServiceStub },
        { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component.dashboardComponentInput = {sessionContext: sessionContext};
    component.dashboardComponentInput = {programContext: programContext};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate component with default Program Level Report', () => {
    expect(component.selectedReport).toEqual('Program Level Report Status');
  });

  it('tableData should be loaded on component initialize', () => {
    expect(component.tableData).toBeDefined();
  });

  it('should have same table rows textbook list count', () => {
    expect(component.tableData.length).toEqual(component.textbookList.length);
  });

  it('should execute generateProgramLevelData on component initialize', () => {
    spyOn(component, 'generateProgramLevelData');
    component.ngOnInit();
    expect(component.generateProgramLevelData).toHaveBeenCalledWith('Program Level Report Status');
  });

  it('should execute generateTableData on component initialize', () => {
    spyOn(component, 'generateTableData');
    component.ngOnInit();
    expect(component.generateTableData).toHaveBeenCalledWith('Program Level Report Status');
  });

  it('should initialize dataTable and stop loading', () => {
    component.showLoader = true;
    fixture.detectChanges();
    component.initializeDataTable('Program Level Report Status');
    expect(component.showLoader).toBeFalsy();
  });

  it('on refresh it should go for api call to fetch text-book', () => {
    component.contentService.post = jasmine.createSpy(' search call spy').and.callFake(() => {
      return observableOf(textbookList);
    });
     component.refreshReport();
     expect(component.contentService.post).toHaveBeenCalled();
  });

  it('on download generateCsv should be called', () => {
    spyOn(ExportToCsv.prototype, 'generateCsv').and.callFake((a) => {
    alert('csv generated');
   });
      spyOn(window, 'alert');
    component.downloadReport();
    expect(window.alert).toHaveBeenCalled();
  });

});
