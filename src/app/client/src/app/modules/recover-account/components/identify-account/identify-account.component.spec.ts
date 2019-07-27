import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyAccountComponent } from './identify-account.component';

describe('IdentifyAccountComponent', () => {
  let component: IdentifyAccountComponent;
  let fixture: ComponentFixture<IdentifyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
