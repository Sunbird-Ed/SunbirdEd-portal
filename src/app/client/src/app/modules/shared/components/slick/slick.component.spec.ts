import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlickComponent } from './slick.component';

describe('SlickComponent', () => {
  let component: SlickComponent;
  let fixture: ComponentFixture<SlickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
