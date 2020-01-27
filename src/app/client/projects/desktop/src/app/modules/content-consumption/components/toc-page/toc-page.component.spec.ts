import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TocPageComponent } from './toc-page.component';

xdescribe('TocPageComponent', () => {
  let component: TocPageComponent;
  let fixture: ComponentFixture<TocPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TocPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
