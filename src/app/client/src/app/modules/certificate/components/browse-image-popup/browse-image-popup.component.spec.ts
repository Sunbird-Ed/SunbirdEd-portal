import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash-es';
import { BrowseImagePopupComponent } from './browse-image-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { BrowserCacheTtlService, ConfigService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { MockData } from './../create-template/create-template.component.spec.data';
import { UploadCertificateService } from '../../services/upload-certificate/upload-certificate.service';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('BrowseImagePopupComponent', () => {
  let component: BrowseImagePopupComponent;
  let fixture: ComponentFixture<BrowseImagePopupComponent>;
  configureTestSuite();

  const resourceBundle = {
    frmelmnts: {
    },
    messages: {
      fmsg: {
        m0004: 'Could not fetch data, try again later'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, FormsModule, CoreModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        ConfigService,
        ToasterService,
        UtilService,
        BrowserCacheTtlService,
        TranslateService,
        TranslateStore,
        UploadCertificateService,
        { provide: ResourceService, useValue: resourceBundle },
      ],
      declarations: [BrowseImagePopupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the images by search api call', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    spyOn(uploadCertService, 'getAssetData').and.returnValue(of(MockData.searchData));
    component.ngOnInit();
    expect(component.imagesList).toEqual(MockData.searchData.result.content);
  });

  it('should not get the images by search api call', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    spyOn(uploadCertService, 'getAssetData').and.callFake(() => throwError({}));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith('Could not fetch data, try again later');
  });

  it('should search one specific image', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    spyOn(uploadCertService, 'getAssetData').and.returnValue(of(MockData.searchSingleImage));
    component.searchImage();
    expect(component.imagesList).toEqual(MockData.searchSingleImage.result.content);
  });

  it('should not search one specific image if api fails', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    spyOn(uploadCertService, 'getAssetData').and.callFake(() => throwError({}));
    component.searchImage();
    expect(toasterService.error).toHaveBeenCalledWith('Could not fetch data, try again later');
  });

  it('should select the logo', () => {
    const logo = {
      artifactUrl: 'SOME_URL',
      name: 'SOME_NAME'
    };
    component.selectLogo(logo);
    expect(component.selectedLogo).toEqual(logo);
  });

  it('should go back', () => {
    spyOn(component.uploadForm, 'reset');
    component.back();
    expect(component.showUploadUserModal).toEqual(false);
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.uploadForm.reset).toHaveBeenCalled();
    expect(component.selectedLogo).toEqual(null);
  });

  it('should close the modal', () => {
    component.claseModel();
    expect(component.showUploadUserModal).toEqual(false);
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.selectedLogo).toEqual(null);
  });

  it('should upload the asset for logos', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    component.logoType = { type: 'LOGO' };
    spyOn(uploadCertService, 'createAsset').and.returnValue(of(MockData.create));
    spyOn(component, 'uploadBlob').and.stub();
    component.upload();
    expect(component.uploadBlob).toHaveBeenCalledWith(MockData.create);
  });

  it('should not upload the asset for logos', () => {
    const uploadCertService = TestBed.get(UploadCertificateService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    component.logoType = { type: 'LOGO' };
    spyOn(uploadCertService, 'createAsset').and.callFake(() => throwError({}));
    component.upload();
    expect(toasterService.error).toHaveBeenCalledWith('Could not fetch data, try again later');
  });

  it('should fetch the image urls for sign', () => {
    component.logoType = { type: 'SIGN' };
    spyOn(component, 'getImageURLs').and.stub();
    component.upload();
    expect(component.getImageURLs).toHaveBeenCalled();
  });

  it('should browse the images', () => {
    component.browseImages();
    expect(component.showUploadUserModal).toEqual(true);
    expect(component.selectedLogo).toEqual(null);
  });

  it('should upload to blob', () => {
    component.logoType = {
      type: 'logo',
      index: 1,
      key: 'SOME_KEY'
    };
    component.uploadForm = new FormGroup({
      assetCaption: new FormControl(null)
    });
    const uploadCertService = TestBed.get(UploadCertificateService);
    spyOn(component.assetData, 'emit').and.stub();
    spyOn(uploadCertService, 'storeAsset').and.returnValue(of(MockData.upload));
    component.uploadBlob(MockData.create);
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.showUploadUserModal).toEqual(false);
    expect(component.assetData.emit).toHaveBeenCalledWith({
      'name': component.uploadForm.controls.assetCaption.value,
      'url': MockData.upload.result.artifactUrl,
      'type': component.logoType.type,
      'key': component.logoType.key,
      'index': component.logoType.index
    });
  });

  it('should not upload to blob', () => {
    const errorData = {
      error: {
        result: {
          artifactUrl: 'SOME_URL'
        }
      }
    };
    component.logoType = {
      type: 'logo',
      index: 1,
      key: 'SOME_KEY'
    };
    component.uploadForm = new FormGroup({
      assetCaption: new FormControl(null)
    });
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    const uploadCertService = TestBed.get(UploadCertificateService);
    spyOn(component.assetData, 'emit').and.stub();
    spyOn(uploadCertService, 'storeAsset').and.callFake(() => throwError(errorData));
    component.uploadBlob(MockData.create);
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.showUploadUserModal).toEqual(false);
    expect(component.assetData.emit).toHaveBeenCalledWith({
      'name': component.uploadForm.controls.assetCaption.value,
      'url': errorData.error.result.artifactUrl,
      'type': component.logoType.type,
      'key': component.logoType.key,
      'index': component.logoType.index
    });
  });

  it('should select and use the logo', () => {
    component.logoType = {
      type: 'logo',
      index: 1,
      key: 'SOME_KEY'
    };
    component.selectedLogo = {
      name: 'SOME_NAME',
      artifactUrl: 'SOME_ARTIFACT_URL'
    };
    spyOn(component.assetData, 'emit').and.stub();
    component.selectAndUseLogo();
    expect(component.selectedLogo).toEqual(null);
  });
});
