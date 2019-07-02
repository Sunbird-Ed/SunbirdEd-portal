import { By } from '@angular/platform-browser';

import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { ActivatedRoute, Router, } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentImportComponent } from './content-import.component';
import { OfflineFileUploaderService } from '../../services';
import { SuiModalModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { DebugElement } from '@angular/core';
describe('ContentImportComponent', () => {
  let component: ContentImportComponent;
  let fixture: ComponentFixture<ContentImportComponent>;
  let offlineFileUploaderService: OfflineFileUploaderService;
  class FakeActivatedRoute {
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ContentImportComponent],
      providers: [ OfflineFileUploaderService, TelemetryService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub } ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportComponent);
    component = fixture.componentInstance;
    offlineFileUploaderService = TestBed.get(OfflineFileUploaderService);
  });

  it('should initialize fileupload  and should call openfilebrowser and setinteract methods', () => {
    const fileuploadSpy = spyOn(offlineFileUploaderService, 'initilizeFileUploader');
    spyOn(component, 'setInteractData');
    spyOn(component, 'openFileBrowser');
    component.ngOnInit();
    expect(fileuploadSpy).toHaveBeenCalled();
    expect(component.setInteractData).toHaveBeenCalled();
    expect(component.openFileBrowser).toHaveBeenCalled();
  });

  it('should call remove firstChild method', () => {
    spyOn(component, 'removeFirstChild');
    component.ngAfterViewInit();
    expect(component.removeFirstChild).toHaveBeenCalled();
  });
  it('should call modal close', () => {
    const returnValue = spyOn(component, 'modalClose');
    const element = fixture.nativeElement.querySelector('#close_modal');
    element.click();
    expect(component.modalClose).toHaveBeenCalledTimes(1);
  });

  it('should call closemodal and should emit an event', () => {
    component.closeModal();
    spyOn(component.closeImportModal, 'emit');
    component.closeModal();
    expect(component.closeImportModal.emit).toHaveBeenCalled();
  });

});
