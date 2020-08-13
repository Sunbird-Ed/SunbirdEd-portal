import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoyThemePopupComponent } from './joy-theme-popup.component';

describe('JoyThemePopupComponent', () => {
  let component: JoyThemePopupComponent;
  let fixture: ComponentFixture<JoyThemePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoyThemePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoyThemePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
