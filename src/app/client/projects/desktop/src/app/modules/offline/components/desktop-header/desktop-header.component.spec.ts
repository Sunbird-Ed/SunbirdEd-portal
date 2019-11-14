import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopHeaderComponent } from './desktop-header.component';

describe('DesktopHeaderComponent', () => {
  let component: DesktopHeaderComponent;
  let fixture: ComponentFixture<DesktopHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
