import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllEvidenceComponent } from './all-evidence.component';
import { DhitiService, CoreModule } from '@sunbird/core';
import { SharedModule, ConfigService } from '@sunbird/shared';
import { SuiModule, SuiModalModule } from 'ng2-semantic-ui-v9';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import {allEvidenceData} from './all-evidence.component.spec.data';
import { SlReportsLibraryModule } from '@shikshalokam/sl-reports-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AllEvidenceComponent', () => {
  let component: AllEvidenceComponent;
  let fixture: ComponentFixture<AllEvidenceComponent>;
  let dhitiService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule.forRoot(),
        SuiModule,
        SuiModalModule,
        TranslateModule,
        SlReportsLibraryModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [AllEvidenceComponent],
      providers: [ConfigService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEvidenceComponent);
    component = fixture.componentInstance;
    dhitiService = TestBed.get(DhitiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngoninit', () => {
    expect(component).toBeTruthy();
    spyOn(dhitiService, 'post').and.returnValue(of(allEvidenceData));
    component.ngOnInit();
    expect(component.images.length).toBeGreaterThan(0);
  });

  it('should call closeModal', () => {
    spyOn(component, 'closeModal').and.callThrough();
    component.modal = {
      approve: () => {},
    };
    component.closeModal();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
