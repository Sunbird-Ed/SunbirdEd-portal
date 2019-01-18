import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageReportsComponent } from './usage-reports.component';

describe('UsageReportsComponent', () => {
  let component: UsageReportsComponent;
  let fixture: ComponentFixture<UsageReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsageReportsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
