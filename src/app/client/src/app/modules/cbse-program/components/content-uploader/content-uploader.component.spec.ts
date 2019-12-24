import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUploaderComponent } from './content-uploader.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService, PlayerService, FrameworkService } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { RouterTestingModule } from "@angular/router/testing";
import {contentUploadComponentInput, contentMetaData, playerConfig, frameworkDetails,
             licenseDetails, updateContentResponse, getPreSignedUrl} from './content-uploader.component.data';
import { HelperService } from '../../services/helper.service';

// Following describe method is for 'PREVIEW' scenario
describe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
  let errorInitiate;
  let errorInitiate1;
  const actionServiceStub = {
    patch() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf('Success');
      }
    },
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(contentMetaData);
      }
    }
  };

  const playerServiceStub = {
    getConfig() {
        return playerConfig;
    }
  };

  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    frameworkData$: observableOf(frameworkDetails)
  };

  const helperServiceStub = {
    getLicences() {
        return observableOf(licenseDetails);
    },
    updateContent() {
      return observableOf(updateContentResponse);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule],
      declarations: [ ContentUploaderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, TelemetryService, PlayerService, ResourceService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                  { provide: HelperService, useValue: helperServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.contentUploadComponentInput = contentUploadComponentInput;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not execute saveContent if Mandatory Form-fields are empty', () => {
    debugElement
      .query(By.css('#saveContent'))
      .triggerEventHandler('click', null);
      expect(component.selectionArr.controls[0].get('bloomslevel').touched).toBeTruthy();
      expect(component.selectionArr.controls[0].get('bloomslevel').errors.required).toBeTruthy();
  });

  it('should execute saveContent after successful validation of Form', () => {
    component.selectionArr.patchValue([{bloomslevel: 'Knowledge (Remembering)'}]);
     fixture.detectChanges();
     spyOn(component.toasterService, 'success');
     debugElement
      .query(By.css('#saveContent'))
      .triggerEventHandler('click', null);
     expect(component.toasterService.success).toHaveBeenCalledWith('Content Updated Successfully...');
  });
});

// Following describe method is for fresh 'UPLOAD' scenario
describe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
  let errorInitiate;
  let errorInitiate1;
  const actionServiceStub = {
    patch() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf('Success');
      }
    },
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(contentMetaData);
      }
    },
    http: {
      put() {
        return observableOf('success');
      }
    },
    post() {
      return observableOf(getPreSignedUrl);
    }
  };

  const playerServiceStub = {
    getConfig() {
        return playerConfig;
    }
  };

  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    frameworkData$: observableOf(frameworkDetails)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule],
      declarations: [ ContentUploaderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, TelemetryService, PlayerService, ResourceService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    contentUploadComponentInput.action = '';
    component.contentUploadComponentInput = contentUploadComponentInput;
    fixture.detectChanges();
  });

  it('should throw error if upload is clicked without browsing files', () => {
    spyOn(component.toasterService, 'error');
    debugElement
      .query(By.css('#uploadContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.error).toHaveBeenCalledWith('File is required to upload');
  });

  it('should upload successfully on select of file', () => {
    component.uploader = {
      getFile() {
        return {uploadedFile: 'dummy'};
      },
      getName() {
        return 'Sample.pdf';
      }
    };
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#uploadContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).toHaveBeenCalledWith('Content Successfully Uploaded...');
  });
});
