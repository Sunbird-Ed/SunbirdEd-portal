import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardContainerComponent } from './info-card-container.component';

describe('InfoCardContainerComponent', () => {
  let component: InfoCardContainerComponent;
  let fixture: ComponentFixture<InfoCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoCardContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
