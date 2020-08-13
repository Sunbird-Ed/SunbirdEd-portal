import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';

import {JoyThemePopupComponent} from './joy-theme-popup.component';
import {configureTestSuite} from '@sunbird/test-util';

describe('JoyThemePopupComponent', () => {
  let component: JoyThemePopupComponent;
  let fixture: ComponentFixture<JoyThemePopupComponent>;
  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [JoyThemePopupComponent]
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
