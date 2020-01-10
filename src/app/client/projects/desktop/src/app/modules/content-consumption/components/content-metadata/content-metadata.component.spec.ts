import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentMetadataComponent } from './content-metadata.component';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { SuiAccordionModule } from 'ng2-semantic-ui';
import { OrderModule } from 'ngx-order-pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {contentMetaData} from './content-metadata.component.spec.data';

describe('ContentMetadataComponent', () => {
  let component: ContentMetadataComponent;
  let fixture: ComponentFixture<ContentMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentMetadataComponent ],
      imports: [SuiAccordionModule, OrderModule, HttpClientTestingModule, SharedModule.forRoot()],
      providers: [
        ResourceService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentMetadataComponent);
    component = fixture.componentInstance;
    const componentInstances = fixture.debugElement.componentInstance;
    componentInstances.contentData = contentMetaData.content;
    component.instance = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the content data is defined or not ', () => {
    expect(component.contentData).toBeTruthy();
  });
  it('should check the keywords of type array  ', () => {
    fixture.detectChanges();
    expect(component.contentData.keywords).toEqual(contentMetaData.content.keywords);
  });
  it('should check the description is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.description).toEqual(contentMetaData.content.description);
  });
  it('should check the board is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.board).toEqual(contentMetaData.content.board);
  });
  it('should check the medium is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.board).toEqual(contentMetaData.content.board);
  });
  it('should check the gradeLevel is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.gradeLevel).toEqual(contentMetaData.content.gradeLevel);
  });
  it('should check the subject is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.subject).toEqual(contentMetaData.content.subject);
  });
  it('should check the license is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.license).toEqual(contentMetaData.content.license);
  });
  it('should check the copy right is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.copyright).toEqual(contentMetaData.content.copyright);
  });
  it('should check the creator is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.creator).toEqual(contentMetaData.content.creator);
  });
  it('should check the author is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.author).toEqual(contentMetaData.content.author);
  });
  it('should check the createdOn is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.createdOn).toEqual(contentMetaData.content.createdOn);
  });
  it('should check the resourceType is defined or not ', () => {
    fixture.detectChanges();
    expect(component.contentData.resourceType).toEqual(contentMetaData.content.resourceType);
  });
});
