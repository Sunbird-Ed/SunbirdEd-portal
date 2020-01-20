import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McqTemplateSelectionComponent } from './mcq-template-selection.component';

xdescribe('McqTempleteSelectionComponent', () => {
  let component: McqTemplateSelectionComponent;
  let fixture: ComponentFixture<McqTemplateSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McqTemplateSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqTemplateSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
