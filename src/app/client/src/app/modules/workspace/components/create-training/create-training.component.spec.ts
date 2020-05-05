import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { CreateTrainingComponent } from './create-training.component';
import { mockRes } from './create-training.component.spec.data';

describe('CreateTrainingComponent', () => {
  let component: CreateTrainingComponent;
  let fixture: ComponentFixture<CreateTrainingComponent>;
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
      imports: [RouterTestingModule, SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule],
      declarations: [ CreateTrainingComponent ],
      providers: [ResourceService, CacheService, ConfigService,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should set the role for course creation and associated resource creation', () => {
      component.courseRole = mockRes.workSpaceRole.courseRole;
      component.lessonRole = mockRes.workSpaceRole.lessonRole;
      component.collectionRole = mockRes.workSpaceRole.collectionRole;
      component.contentUploadRole = mockRes.workSpaceRole.contentUploadRole;
      component.assessmentRole = mockRes.workSpaceRole.assessmentRole;
      component.ngOnInit();
      expect(component.courseRole).toBeDefined();
      expect(component.lessonRole).toBeDefined();
      expect(component.collectionRole).toBeDefined();
      expect(component.contentUploadRole).toBeDefined();
      expect(component.assessmentRole).toBeDefined();
      expect(component).toBeTruthy();
    });
});
