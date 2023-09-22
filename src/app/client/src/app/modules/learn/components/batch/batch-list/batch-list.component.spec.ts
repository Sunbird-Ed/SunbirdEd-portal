import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchListComponent } from './batch-list.component';

describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
