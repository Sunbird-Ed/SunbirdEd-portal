import { Component,Input,OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { CurriculumInfoComponent, ICurriculum } from './curriculum-info.component';

describe('CurriculumInfoComponent', () => {
    let component: CurriculumInfoComponent;

    const mockResourceService :Partial<ResourceService> ={
        frmelmnts: {
            lbl: {
              pdfcontents: 'mock-pdf-contents',
              videos: 'mock-videos',
              imagecontents: 'mock-image-contents',
              htmlarchives: 'mock-html-archives',
              ecmlarchives: 'mock-ecml-archives',
              epubarchives: 'mock-epub-archives',
              h5parchives: 'mock-h5p-archives',
            }
        }
    };

    beforeAll(() => {
        component = new CurriculumInfoComponent(
            mockResourceService as ResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        component.curriculum = [];
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    
    describe('ngOnInit',()=>{
        it('should initialize curriculum list correctly for PDF mimeType', () => {
            const mimeTypeList = [{ mimeType: 'application/pdf', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-pdf-contents', count: 3, class: 'file pdf outline icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });
        
        it('should initialize curriculum list correctly for video mimeType', () => {
            const mimeTypeList = [{ mimeType: 'video', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-videos', count: 3, class: 'file video outline icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });

        it('should initialize curriculum list correctly for image mimeType', () => {
            const mimeTypeList = [{ mimeType: 'image', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-image-contents', count: 3, class: 'file image outline icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });
         
        it('should initialize curriculum list correctly for html-archive mimeType', () => {
            const mimeTypeList = [{ mimeType: 'application/vnd.ekstep.html-archive', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-html-archives', count: 3, class: 'html5 icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });

        it('should initialize curriculum list correctly for ecml-archive mimeType', () => {
            const mimeTypeList = [{ mimeType: 'application/vnd.ekstep.ecml-archive', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-ecml-archives', count: 3, class: 'file archive outline icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });

        it('should initialize curriculum list correctly for epub mimeType', () => {
            const mimeTypeList = [{ mimeType: 'application/epub', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-epub-archives', count: 3, class: 'file archive outline icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });

        it('should initialize curriculum list correctly for epub mimeType', () => {
            const mimeTypeList = [{ mimeType: 'application/vnd.ekstep.h5p-archive', count: 3 }];
            component.mimeTypeList = mimeTypeList;
            component.ngOnInit();
        
            const expectedCurriculum: ICurriculum[] = [
            { label: 'mock-h5p-archives', count: 3, class: 'file archive outline icon' }];
            expect(component.curriculum).toEqual(expectedCurriculum);
        });
    })  
});