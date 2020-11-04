import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUploaderComponent } from './content-uploader.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryModule } from '@sunbird/telemetry';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService, PlayerService, FrameworkService, UserService } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { RouterTestingModule } from '@angular/router/testing';
import {contentUploadComponentInput, contentMetaData, contentMetaData1, playerConfig, frameworkDetails,
             licenseDetails, updateContentResponse, getPreSignedUrl, contentUploadComponentInput1} from './content-uploader.component.data';
import { HelperService } from '../../services/helper.service';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateLoader, TranslateFakeLoader, TranslateModule } from '@ngx-translate/core';
// Following describe method is for 'PREVIEW' scenario
describe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
  // tslint:disable-next-line:prefer-const
  let errorInitiate;
    // tslint:disable-next-line:prefer-const
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
    },
    reviewContent() {
      return observableOf('success');
    }
  };

  const resourceServiceStub = {
    messages: {
      fmsg: {
        m0076: 'Please Fill Mandatory Fields!',
      },
      smsg: {
        m0060: 'Content added to Hierarchy Successfully...'
      }
    }
  };

  const userServiceStub = {
    userProfile: {
      userId: '123456789'
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
         }
      }),HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule, SharedModule.forRoot()],
      declarations: [ ContentUploaderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, TelemetryService, PlayerService, ResourceService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                  { provide: HelperService, useValue: helperServiceStub }, { provide: ResourceService, useValue: resourceServiceStub },
                  {provide: UserService, useValue: userServiceStub},
                  {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}}, DeviceDetectorService]
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should not execute saveContent if Mandatory Form-fields are empty', () => {
    component.ngOnInit();
    debugElement
      .query(By.css('#saveContent'))
      .triggerEventHandler('click', null);
      expect(component.contentDetailsForm.get('bloomslevel').touched).toBeTruthy();
      expect(component.contentDetailsForm.get('bloomslevel').errors.required).toBeTruthy();
  });

  xit('should execute saveContent after successful validation of Form without calling sendForReview', () => {
    component.contentDetailsForm.get('bloomslevel').patchValue([{bloomslevel: 'Knowledge (Remembering)'}]);
    component.editTitle = 'Explanation Content Test1';
     fixture.detectChanges();
     spyOn(component, 'sendForReview');
     debugElement
      .query(By.css('#saveContent'))
      .triggerEventHandler('click', null);
     expect(component.sendForReview).not.toHaveBeenCalled();
  });

  xit('should execute sendForReview before successful saveContent', () => {
    component.contentDetailsForm.get('bloomslevel').patchValue([{bloomslevel: 'Knowledge (Remembering)'}]);
    component.editTitle = 'Explanation Content Test1';
     fixture.detectChanges();
     spyOn(component, 'sendForReview');
     debugElement
      .query(By.css('#submitContent'))
      .triggerEventHandler('click', null);
     expect(component.sendForReview).toHaveBeenCalled();
  });

  xit('should Preview be playing, when even clicked on changeFile', () => {
    component.showUploadModal = true;
    fixture.detectChanges();
    spyOn(component, 'showPreview');
    debugElement
    .query(By.css('#changeContent'))
    .triggerEventHandler('click', null);
    expect(component.showPreview).toBeTruthy();
  });

});

// Following describe method is for fresh 'UPLOAD' scenario
describe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
    // tslint:disable-next-line:prefer-const
  let errorInitiate;
    // tslint:disable-next-line:prefer-const
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule],
      declarations: [ ContentUploaderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, TelemetryService, PlayerService, ResourceService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                 {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}}, DeviceDetectorService]
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

  xit('should throw error if upload is clicked without browsing files', () => {
    spyOn(component.toasterService, 'error');
    debugElement
      .query(By.css('#uploadContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.error).toHaveBeenCalledWith('File is required to upload');
  });

  xit('should upload successfully on select of file', () => {
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

// Following describe method is for 'REVIEWER' role scenario
describe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
  // tslint:disable-next-line:prefer-const
  let errorInitiate;
  // tslint:disable-next-line:prefer-const
  let errorInitiate1;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(contentMetaData1);
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
    publishContent() {
      return observableOf({
        result: { node_id: '123'}
      });
    },
    submitRequestChanges() {
      return observableOf({
        result: { node_id: '123'}
      });
    }
  };
  const collectionServiceStub = {
    addResourceToHierarchy() {
      return observableOf('success');
    }
  };

  const userServiceStub = {
    userProfile: {
      userId: '123456789'
    }
  };
  const resourceServiceStub = {
    messages: {
      smsg: {
        m0063: 'Content Published Successfully...',
        m0062: 'Content sent for changes Successfully...'
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule],
      declarations: [ ContentUploaderComponent ],
      providers: [ ConfigService, UtilService, ToasterService, TelemetryService, PlayerService, ResourceService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                  { provide: HelperService, useValue: helperServiceStub }, {provide: UserService, useValue: userServiceStub},
                  { provide: CollectionHierarchyService, useValue: collectionServiceStub},
                  // tslint:disable-next-line:max-line-length
                  { provide: ResourceService, useValue: resourceServiceStub }, {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}}, DeviceDetectorService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.contentUploadComponentInput = contentUploadComponentInput1;
    fixture.detectChanges();
  });

  xit('should be success when reviewer publishes content', () => {
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#publishContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).toHaveBeenCalledWith('Content Published Successfully...');
  });

  xit('should not be able to reject content without comments', () => {
    spyOn(helperServiceStub, 'submitRequestChanges');
    debugElement
      .query(By.css('#requestChanges'))
      .triggerEventHandler('click', null);
      expect(helperServiceStub.submitRequestChanges).not.toHaveBeenCalled();
  });

});
