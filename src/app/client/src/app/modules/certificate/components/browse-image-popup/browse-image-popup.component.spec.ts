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
    expect(component.uploadForm).toBeTruthy();
  });

  it('should getAssetData', () => {
    spyOn(component.uploadCertificateService, 'getAssetData').and.returnValue(of (MockData.searchSingleImage));
    component.getAssetList();

    expect(component.imageName).toEqual('');
    component.uploadCertificateService.getAssetData().subscribe(data => {
      expect(data).toEqual(MockData.searchSingleImage);
      expect(component.imagesList).toEqual(data.result.content);
    });
  });

  it('should throw on getAssetData', () => {
    spyOn(component.uploadCertificateService, 'getAssetData').and.returnValue(throwError ({}));
    spyOn(component.toasterService, 'error');
    component.getAssetList();
    expect(component.imageName).toEqual('');
    component.uploadCertificateService.getAssetData().subscribe(data => {},
      err => {
        expect(component.toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
      });
  });

  it('should search one specific image', () => {
    spyOn(component.uploadCertificateService, 'getAssetData').and.returnValue(of (MockData.searchSingleImage));
    component.searchImage();
    component.uploadCertificateService.getAssetData().subscribe(data => {
      expect(data).toEqual(MockData.searchSingleImage);
      expect(component.imagesList).toEqual(data.result.content);
    });
  });

  it('should not search one specific image if api fails', () => {
    spyOn(component.toasterService, 'error').and.stub();
    spyOn(component.uploadCertificateService, 'getAssetData').and.callFake(() => throwError({}));
    component.searchImage();
    component.uploadCertificateService.getAssetData().subscribe(data => {},
      err => {
        expect(component.toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
      });
  });


  it ('should update upload form data ', async () => {
    const ev = { target: { files: [{
        height: 88,
        size: 0.01,
        type: 'image/png',
        width: 88,
        name: 'file1'
        }]
      }
    };
    const result = Promise.resolve(ev.target.files[0]);
    spyOn(component, 'getImageProperties').and.returnValue(result);
    spyOn(component, 'dimentionCheck').and.returnValue(true);
    spyOn(component.uploadForm, 'reset');
    spyOn(component.uploadForm, 'patchValue');
    component.fileChange(ev);
    expect(component.getImageProperties).toHaveBeenCalledWith(ev);
    expect(component.uploadForm.reset).toHaveBeenCalled();
    expect(await component.dimentionCheck).toHaveBeenCalledWith(ev.target.files[0]);
    expect( component.uploadForm.reset).toHaveBeenCalled();
    expect( component.uploadForm.patchValue).toHaveBeenCalledWith({
      assetCaption: 'file1',
      creator: ' ',
      creatorId: undefined
    });
  });

  it ('should return "flag=true"', () => {
    component.logoType =  {type: 'LOGO'};
    const value = component.dimentionCheck({
      height: 88,
      size: 0.01,
      type: 'image/png',
      width: 88,
      name: 'file1'
    });
    expect(value).toBeTruthy();
  });

  it ('should return "flag=false"', () => {
    component.logoType =  {type: 'LOGO'};
    const value = component.dimentionCheck('');
    expect(value).toBeFalsy();
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
    component.logoType  = {
      'type' : 'LOGO'
    };
    component.sign = 'SIGN';
    component.back();
    expect(component.showUploadUserModal).toEqual(false);
    expect(component.showSelectImageModal).toEqual(true);
    expect(component.uploadForm.reset).toHaveBeenCalled();
    expect(component.selectedLogo).toEqual(null);
  });

  it('should go back', () => {
    spyOn(component, 'closeModel');
    component.logoType  = {
      'type' : 'SIGN'
    };
    component.sign = 'SIGN';
    component.back();
    expect(component.closeModel).toHaveBeenCalled();
  });

  it('should close the modal', () => {
    component.closeModel();
    expect(component.showUploadUserModal).toEqual(false);
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.selectedLogo).toEqual(null);
  });

  it('should upload the asset for logos', () => {
    component.logoType = { type: 'LOGO' };
    spyOn(component.uploadCertificateService, 'createAsset').and.returnValue(of(MockData.create));
    spyOn(component, 'uploadBlob').and.stub();
    component.upload();
    expect(component.uploadBlob).toHaveBeenCalledWith(MockData.create);
  });

  it('should not upload the asset for logos', () => {
    spyOn(component.toasterService, 'error').and.stub();
    component.logoType = { type: 'LOGO' };
    spyOn(component.uploadCertificateService, 'createAsset').and.callFake(() => throwError({}));
    component.upload();
    expect(component.toasterService.error).toHaveBeenCalledWith('Could not fetch data, try again later');
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
    spyOn(component.assetData, 'emit').and.stub();
    spyOn(component.uploadCertificateService, 'storeAsset').and.returnValue(of(MockData.upload));
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

    spyOn(component.toasterService, 'error').and.stub();
    spyOn(component.assetData, 'emit').and.stub();
    spyOn(component.uploadCertificateService, 'storeAsset').and.callFake(() => throwError(errorData));
    component.uploadBlob(MockData.create);
    expect(component.showSelectImageModal).toEqual(false);
    expect(component.showUploadUserModal).toEqual(false);
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
