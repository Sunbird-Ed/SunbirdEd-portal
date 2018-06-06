import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { CreateContentComponent } from './create-content.component';
import { CacheService } from 'ng2-cache-service';
import * as mockData from './create-content.component.spec.data';
const testData = mockData.mockRes;
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
describe('CreateContentComponent', () => {
  let component: CreateContentComponent;
  let fixture: ComponentFixture<CreateContentComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule.forRoot(), HttpClientTestingModule, CoreModule.forRoot(), TelemetryModule],
      declarations: [CreateContentComponent],
      providers: [ResourceService, CacheService, ConfigService,
       {provide: ActivatedRoute, useValue: fakeActivatedRoute}]
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
