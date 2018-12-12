import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAllBatchesComponent } from './test-all-batches.component';

describe('TestAllBatchesComponent', () => {
  let component: TestAllBatchesComponent;
  let fixture: ComponentFixture<TestAllBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAllBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAllBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
