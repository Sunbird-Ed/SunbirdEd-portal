import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionEditorComponent } from './new-collection-editor.component';

describe('NewCollectionEditorComponent', () => {
  let component: NewCollectionEditorComponent;
  let fixture: ComponentFixture<NewCollectionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCollectionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCollectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
