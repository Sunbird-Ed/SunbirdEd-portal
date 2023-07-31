import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCardContainerComponent } from './summary-card-container.component';

describe('SummaryCardContainerComponent', () => {
  let component: SummaryCardContainerComponent;
  let fixture: ComponentFixture<SummaryCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryCardContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
