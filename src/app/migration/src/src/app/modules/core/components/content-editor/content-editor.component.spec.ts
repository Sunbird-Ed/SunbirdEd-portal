import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditorComponent } from './content-editor.component';

describe('ContentEditorComponent', () => {
  let component: ContentEditorComponent;
  let fixture: ComponentFixture<ContentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
