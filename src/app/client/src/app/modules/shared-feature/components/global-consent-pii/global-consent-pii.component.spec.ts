import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConsentPiiComponent } from './global-consent-pii.component';

describe('GlobalConsentPiiComponent', () => {
  let component: GlobalConsentPiiComponent;
  let fixture: ComponentFixture<GlobalConsentPiiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalConsentPiiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalConsentPiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
