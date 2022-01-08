import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedUserReportComponent } from './detailed-user-report.component';

describe('DetailedUserReportComponent', () => {
  let component: DetailedUserReportComponent;
  let fixture: ComponentFixture<DetailedUserReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedUserReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
