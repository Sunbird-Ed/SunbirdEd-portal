import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { CbseProgramService } from '../../services';
import { TelemetryService } from '@sunbird/telemetry';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { AppLoaderComponent } from '../../../shared/components/app-loader/app-loader.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { role, selectedAttributes, sampleTextbook, textbookList, chapterlistSample, textbookMeta } from './dashboard.component.data';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { CoreModule, ActionService, UserService, PublicDataService } from '@sunbird/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
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

  const PublicDataServiceStub = {
    post() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(textbookList);
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule],
      declarations: [ DashboardComponent, AppLoaderComponent ],
      providers: [ConfigService, UtilService, ToasterService, CbseProgramService, TelemetryService, ResourceService, CacheService, BrowserCacheTtlService, 
                     { provide: PublicDataService, useValue: PublicDataServiceStub }, { provide: ActionService, useValue: actionServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.selectedAttributes = selectedAttributes;
    fixture.detectChanges();
  });

  it('should initiate component with default Program Level Report', () => {
    expect(component).toBeTruthy();
    expect(component.selectedReport).toEqual('Program Level Report Status');
    expect(component.tableData).toBeDefined();
  });

  it('should have same table rows textbook list count', () => {
    component.generateProgramLevelData('Program Level Report Status');
    expect(component.tableData.length).toEqual(component.textbookList.length);
  });

  it('should initialize dataTable and stop loading', () => {
    component.showLoader = true;
    fixture.detectChanges();
    spyOn(component, 'initializeDataTable').and.callThrough();
    component.initializeDataTable('Program Level Report Status');
    expect(component.showLoader).toBeFalsy();
  });


});
