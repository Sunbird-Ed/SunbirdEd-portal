import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchInfoComponent } from './batch-info.component';

describe('BatchInfoComponent', () => {
  let component: BatchInfoComponent;
  let fixture: ComponentFixture<BatchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
