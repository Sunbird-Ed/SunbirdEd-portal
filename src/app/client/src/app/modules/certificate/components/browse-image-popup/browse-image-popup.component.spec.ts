import { of, throwError } from "rxjs";
import { UserService } from'@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { UploadCertificateService } from "../../services/upload-certificate/upload-certificate.service";
import { BrowseImagePopupComponent } from "./browse-image-popup.component";
import {MockData} from './browse-image-popup.component.spec.data'
import { FormControl, FormGroup } from "@angular/forms";

export class FileReaderMock {
    DONE = FileReader.DONE;
    EMPTY = FileReader.EMPTY;
    LOADING = FileReader.LOADING;
    readyState: 0 | 1 | 2 = 0;
    error: FileReader['error'] = null;
    result: FileReader['result'] = null;
    abort = jest.fn();
    addEventListener = jest.fn();
    dispatchEvent = jest.fn();
    onabort = jest.fn();
    onerror = jest.fn();
    onload = jest.fn();
    onloadend = jest.fn();
    onloadprogress = jest.fn();
    onloadstart = jest.fn();
    onprogress = jest.fn();
    readAsArrayBuffer = jest.fn();
    readAsBinaryString = jest.fn();
    readAsDataURL = jest.fn();
    readAsText = jest.fn();
    removeEventListener = jest.fn();
  }
  
describe("BrowseImagePopupComponent", () => {
    let component: BrowseImagePopupComponent;

    const mockUploadCertificateService: Partial<UploadCertificateService> = {};
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            fmsg:{
                m0004: "Could not fetch data, try again later"
            }
        },
        frmelmnts:{cert:{lbl:{imageErrorMsg: "The image exceeds the maximum supported file size"}}}
    };
    const mockUserService: Partial<UserService> = {};
    let uploadFile = {target: {files:[{
        'lastModified': '1646910621859',
        'lastModifiedDate': 'Thu Mar 10 2022 16:40:21 GMT+0530 (India Standard Time)',
        'name': "Screenshot.png",
        'size': 427604,
        'type': "image/png",
        'webkitRelativePath': ""
    }]}};
    
    
    beforeAll(() => {
        component = new BrowseImagePopupComponent(
            mockUploadCertificateService as UploadCertificateService,
            mockToasterService as ToasterService,
            mockResourceService as  ResourceService,
            mockUserService as UserService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of BrowseImagePopupComponent', () => {
        expect(component).toBeTruthy();
    });

    describe("getAssetList", () => {
        it('should get Asset List', () => {
            // arrange
            mockUploadCertificateService.getAssetData = jest.fn(() => of({result:{content:{}}})) as any;
            // act
            component.getAssetList();
            // assert
            expect(component.imagesList).toBeDefined();
        });

        it('should show error toaster while get Asset List failed', () => {
            // arrange
            mockUploadCertificateService.getAssetData = jest.fn(() => throwError({})) as any;
            // act
            component.getAssetList();
            // assert
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0004);
        });
    });

    describe("searchImage", () => {
        it('should search images by passing image name', () => {
            // arrange
            component.imageName = "apgov-compress";
            mockUploadCertificateService.getAssetData = jest.fn(() => of(MockData.imageSearchResult)) as any;
            // act
            component.searchImage();
            // assert
            expect(component.imagesList).toEqual(MockData.imageSearchResult.result.content);
        });

        it('should search images by passing image name and type', () => {
            // arrange
            component.imageName = "apgov-compress";
            mockUploadCertificateService.getAssetData = jest.fn(() => of(MockData.imageSearchResult)) as any;
            // act
            component.searchImage('test');
            // assert
            expect(component.allImagesList).toEqual(MockData.imageSearchResult.result.content);
        });

        it('should show error toaster while search iamge failed', () => {
            // arrange
            mockUploadCertificateService.getAssetData = jest.fn(() => throwError({})) as any;
            // act
            component.searchImage();
            // assert
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0004);
        });
    });
    
    describe("diementionCheck", () => {
        it ('should return "flag=true" for dimentionCheck', () => {
            // arrange
            component.logoType =  {type: 'LOGO'};
             // act
            const value = component.dimentionCheck({
              height: 88,
              size: 0.01,
              type: 'image/png',
              width: 88,
              name: 'file1'
            });
             // assert
            expect(value).toBeTruthy();
        });
        
        it ('should return "flag=false" for dimentionCheck', () => {
            component.logoType =  {type: 'LOGO'};
            const value = component.dimentionCheck('');
            expect(value).toBeFalsy();
        });
    })

    describe("getImageProperties", () => {
        it("should get image properties", () => {
            global.URL.createObjectURL = jest.fn(() => 'details');
            let onloadRef: Function | undefined;
            const mFile = new File(['go'], 'go.pdf');
            const fileData = { target: { files: [mFile] } };
            Object.defineProperty(Image.prototype, 'onload', {
                get() {
                  return this._onload;
                },
                set(onload: Function) {
                  onloadRef = onload;
                  this._onload = onload;
                },
            });
            component.getImageProperties(fileData).then((data) => {
                expect(data).toEqual({ height: 0, width: 0, size: NaN, type: undefined })
            })
            onloadRef()
        })
    })

    describe("fileChange", () => {
        it('should change file', ((done) => {
            // arrange
            const imagedata = {
                'height': 100,
                'width': 100,
                'size': 0,
                'type': 'image/png'
            }
            jest.spyOn(component, 'getImageProperties').mockReturnValue(new Promise((resolve) => resolve(imagedata))) as any;
            jest.spyOn(component, 'dimentionCheck').mockReturnValue(true);
            component.uploadForm.patchValue = jest.fn();

            // act
            component.fileChange(uploadFile);
            // assert
            setTimeout(() => {
                expect(component.uploadForm.patchValue).toHaveBeenCalled();
                done()
            });
        }));

        it('should show validation error while changing file', ((done) => {
            // arrange
            const imagedata = {
                'height': 100,
                'width': 100,
                'size': 0,
                'type': 'image/png'
            }
            jest.spyOn(component, 'getImageProperties').mockReturnValue(new Promise((resolve) => resolve(imagedata))) as any;
            jest.spyOn(component, 'dimentionCheck').mockReturnValue(false);
            // act
            component.fileChange(uploadFile);
            // assert
            setTimeout(() => {
                expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.frmelmnts.cert.lbl.imageErrorMsg);
                done()
            });
        }));
    });
    
    describe("getAllImages", () => {
        it('should get All Images', () => {
            // arrange
            mockUploadCertificateService.getAssetData = jest.fn(() => of(MockData.imageSearchResult)) as any;
            // act
            component.getAllImages();
            // assert
            expect(component.allImagesList).toBeDefined();
        });

        it('should show error while getting all images failed', () => {
            // arrange
            mockUploadCertificateService.getAssetData = jest.fn(() => throwError({})) as any;
            // act
            component.getAllImages();
            // assert
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0004);
        });
    });
    
    describe("selectLogo", () => {
        it('should select the logo', ((done) => {
            jest.spyOn(component, 'dimentionCheck').mockReturnValue(true);
            const logo = {
              artifactUrl: 'SOME_URL',
              name: 'SOME_NAME',
              type: 'image/png',
              size: 0.01
            };
            const imageDImensions = {
              'height': 88,
              'width': 88,
              'size': 0.01,
              'type': 'image/png'
            };
            jest.spyOn(component, 'getImageProperties').mockReturnValue(new Promise((resolve) => resolve(imageDImensions)));
            component.selectLogo(logo);
            setTimeout(() => {
                expect(component.selectedLogo).toEqual(logo);
                done()
            });
        }));

        it('should show error if image validation failed', ((done) => {
            jest.spyOn(component, 'dimentionCheck').mockReturnValue(true);
            const logo = {
              artifactUrl: 'SOME_URL',
              name: 'SOME_NAME',
              type: 'image/png',
              size: 0.01
            };
            const imageDImensions = {
              'height': 88,
              'width': 88,
              'size': 1,
              'type': 'image/png'
            };
            jest.spyOn(component, 'getImageProperties').mockReturnValue(new Promise((resolve) => resolve(imageDImensions)));
            component.selectLogo(logo);
            setTimeout(() => {
                expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.frmelmnts.cert.lbl.imageErrorMsg);
                done()
            });
        }));
    }) 

    describe("GoBack and close modal", () => {
        it('should go back', () => {
            component.uploadForm.reset = jest.fn();
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
            jest.spyOn(component, 'closeModel');
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
    })

    describe("uploadBlob", () => {
        it('should upload to blob', () => {
            component.logoType = {
              type: 'logo',
              index: 1,
              key: 'SOME_KEY'
            };
            component.uploadForm = new FormGroup({
              assetCaption: new FormControl(null)
            });
            jest.spyOn(component.assetData, 'emit');
            jest.spyOn(component, 'closeModel').mockImplementation();
            mockUploadCertificateService.storeAsset = jest.fn(() => of(MockData.upload));
            component.uploadBlob(MockData.create);
            expect(component.showSelectImageModal).toEqual(false);
            expect(component.showUploadUserModal).toEqual(false);
            expect(component.closeModel).toHaveBeenCalled();
            expect(component.assetData.emit).toHaveBeenCalledWith({
              'name': component.uploadForm.controls.assetCaption.value,
              'url': MockData.upload.result.artifactUrl,
              'type': component.logoType.type,
              'key': component.logoType.key,
              'index': component.logoType.index
            });
        });

        it('should not upload to blob', () => {
            component.logoType = {
              type: 'logo',
              index: 1,
              key: 'SOME_KEY'
            };
            jest.spyOn(component, 'closeModel').mockImplementation();
            mockUploadCertificateService.storeAsset = jest.fn(() => throwError({}));
            component.uploadBlob(MockData.create);
            expect(component.showSelectImageModal).toEqual(false);
            expect(component.showUploadUserModal).toEqual(false);
            expect(component.closeModel).toHaveBeenCalled();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0004);
        });
    })

    describe("getImageURLs", () => {
        it("should convert images files as data URLs", (() => {
            component.logoType = {
                type: 'logo',
                index: 1,
                key: 'SOME_KEY'
            };
            component.uploadForm = new FormGroup({
                assetCaption: new FormControl(null)
            });
            const mFile = new File(['go'], 'go.pdf');
            component.fileObj = { target: { files: [mFile] } };
            const fileReader = new FileReaderMock();
            let onloadRef;
            Object.defineProperty(fileReader, 'onload', {
                get() {
                    return this._onload;
                },
                set(onload) {
                    onloadRef = onload;
                    this._onload = onload;
                }
            });
            jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader);
            jest.spyOn(component.assetData, 'emit');
            jest.spyOn(component, 'closeModel').mockImplementation();
            fileReader.result = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11312763976015872012/artifact/apgov.png';
            component.getImageURLs();
            onloadRef();
            expect(component.closeModel).toHaveBeenCalled();
            expect(component.assetData.emit).toHaveBeenCalledWith({
              'name': component.uploadForm.controls.assetCaption.value,
              'url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11312763976015872012/artifact/apgov.png',
              'type': component.logoType.type,
              'key': component.logoType.key,
              'index': component.logoType.index
            });

        }))
    })
    
    describe("upload asset", () => {
        it('should upload the asset for logos', () => {
            component.logoType = { type: 'LOGO' };
            mockUploadCertificateService.createAsset = jest.fn(() => of(MockData.create))
            jest.spyOn(component, 'uploadBlob').getMockImplementation();
            component.upload();
            expect(component.uploadBlob).toHaveBeenCalledWith(MockData.create);
        });
    
        it('should not upload the asset for logos', () => {
            component.logoType = { type: 'LOGO' };
            mockUploadCertificateService.createAsset = jest.fn(() => throwError({})); 
            component.upload();
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0004);
        });

        it('should get image url if logo type and sign are matched', () => {
            component.logoType = { type: 'LOGO' };
            component.sign = 'LOGO'
            jest.spyOn(component, 'getImageURLs');
            component.upload();
            expect(component.getImageURLs).toHaveBeenCalled();
        });
    })

    it('should browse the images', () => {
        component.browseImages();
        expect(component.showUploadUserModal).toEqual(true);
        expect(component.selectedLogo).toEqual(null);
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
        jest.spyOn(component.assetData, 'emit');
        jest.spyOn(component, 'closeModel').mockImplementation();
        component.selectAndUseLogo();
        expect(component.selectedLogo).toEqual(null);
        expect(component.closeModel).toHaveBeenCalled();
    });
    
    it('should show Upload Signature', () => {
        component.logoType = { type: 'SIGN', index: 0, key: 'SIGN1' };
        component.showUploadSignature();
        expect(component.showSelectImageModal).toBeFalsy();
        expect(component.showUploadUserModal).toBeTruthy();
    });

    
    
   
})