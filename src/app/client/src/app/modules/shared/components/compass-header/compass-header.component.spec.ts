import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassHeaderComponent } from './compass-header.component';

describe('CompassHeaderComponent', () => {
  let component: CompassHeaderComponent;
  let fixture: ComponentFixture<CompassHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompassHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompassHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
