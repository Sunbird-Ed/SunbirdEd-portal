import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService , ConfigService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { CreateContentComponent } from './create-content.component';
import { CacheService } from 'ng2-cache-service';
import * as mockData from './create-content.component.spec.data';
const testData = mockData.mockRes;
describe('CreateContentComponent', () => {
  let component: CreateContentComponent;
  let fixture: ComponentFixture<CreateContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, HttpClientTestingModule, CoreModule ],
      declarations: [ CreateContentComponent ],
      providers: [ResourceService, CacheService, ConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the role for content creation', () => {
    component.textBookRole = testData.workSpaceRole.textBookRole;
    component.courseRole = testData.workSpaceRole.courseRole;
    component.lessonRole = testData.workSpaceRole.lessonRole;
    component.collectionRole = testData.workSpaceRole.collectionRole;
    component.lessonplanRole = testData.workSpaceRole.lessonplanRole;
    component.contentUploadRole = testData.workSpaceRole.lessonplanRole;
    component.ngOnInit();
    expect(component.textBookRole).toBeDefined();
    expect(component.courseRole).toBeDefined();
    expect(component.lessonRole).toBeDefined();
    expect(component.collectionRole).toBeDefined();
    expect(component.lessonplanRole).toBeDefined();
    expect(component.contentUploadRole).toBeDefined();
    expect(component).toBeTruthy();
  });
});
