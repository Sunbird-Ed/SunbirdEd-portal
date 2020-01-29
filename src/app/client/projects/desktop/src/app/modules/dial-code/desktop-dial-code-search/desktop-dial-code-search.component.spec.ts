import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopDialCodeSearchComponent } from './desktop-dial-code-search.component';

describe('DesktopDialCodeSearchComponent', () => {
  let component: DesktopDialCodeSearchComponent;
  let fixture: ComponentFixture<DesktopDialCodeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopDialCodeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopDialCodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
