import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseBatchComponent } from './view-course-batch.component';

describe('ViewCourseBatchComponent', () => {
  let component: ViewCourseBatchComponent;
  let fixture: ComponentFixture<ViewCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCourseBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCourseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
