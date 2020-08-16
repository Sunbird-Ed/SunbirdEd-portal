import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertPreviewPopupComponent } from './cert-preview-popup.component';
import { SuiModule } from 'ng2-semantic-ui';

describe('CertPreviewPopupComponent', () => {
  let component: CertPreviewPopupComponent;
  let fixture: ComponentFixture<CertPreviewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [ CertPreviewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertPreviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
