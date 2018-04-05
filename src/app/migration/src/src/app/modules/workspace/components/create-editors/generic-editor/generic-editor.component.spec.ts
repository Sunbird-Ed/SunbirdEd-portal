import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericEditorComponent } from './generic-editor.component';

describe('GenericEditorComponent', () => {
  let component: GenericEditorComponent;
  let fixture: ComponentFixture<GenericEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
