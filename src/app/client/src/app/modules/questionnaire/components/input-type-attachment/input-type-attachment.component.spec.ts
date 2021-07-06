import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTypeAttachmentComponent } from './input-type-attachment.component';

xdescribe('InputTypeAttachmentComponent', () => {
  let component: InputTypeAttachmentComponent;
  let fixture: ComponentFixture<InputTypeAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTypeAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTypeAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
