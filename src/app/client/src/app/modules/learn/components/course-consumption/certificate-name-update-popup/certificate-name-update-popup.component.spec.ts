import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateNameUpdatePopupComponent } from './certificate-name-update-popup.component';

describe('CertificateNameUpdatePopupComponent', () => {
  let component: CertificateNameUpdatePopupComponent;
  let fixture: ComponentFixture<CertificateNameUpdatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateNameUpdatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateNameUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
