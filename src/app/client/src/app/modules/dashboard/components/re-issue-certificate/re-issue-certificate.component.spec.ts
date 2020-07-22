import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCertificateComponent } from './re-issue-certificate.component';

describe('ReIssueCertificateComponent', () => {
  let component: ReIssueCertificateComponent;
  let fixture: ComponentFixture<ReIssueCertificateComponent>;

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
