import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UciComponent } from './uci.component';

describe('UciComponent', () => {
  let component: UciComponent;
  let fixture: ComponentFixture<UciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
