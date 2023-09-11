import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCreditsComponent } from './media-credits.component';

describe('MediaCreditsComponent', () => {
  let component: MediaCreditsComponent;
  let fixture: ComponentFixture<MediaCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
