import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertPreviewPopupComponent } from './cert-preview-popup.component';

describe('CertPreviewPopupComponent', () => {
  let component: CertPreviewPopupComponent;
  let fixture: ComponentFixture<CertPreviewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
