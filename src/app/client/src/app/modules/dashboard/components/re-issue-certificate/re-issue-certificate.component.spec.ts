import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCertificateComponent } from './re-issue-certificate.component';
import { configureTestSuite } from '@sunbird/test-util';

describe('ReIssueCertificateComponent', () => {
  let component: ReIssueCertificateComponent;
  let fixture: ComponentFixture<ReIssueCertificateComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReIssueCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReIssueCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
