import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopProminentFilterComponent } from './desktop-prominent-filter.component';

xdescribe('DesktopProminentFilterComponent', () => {
  let component: DesktopProminentFilterComponent;
  let fixture: ComponentFixture<DesktopProminentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopProminentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopProminentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
