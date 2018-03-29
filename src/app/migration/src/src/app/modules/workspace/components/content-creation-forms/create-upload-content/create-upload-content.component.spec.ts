import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUploadContentComponent } from './create-upload-content.component';

describe('CreateUploadContentComponent', () => {
  let component: CreateUploadContentComponent;
  let fixture: ComponentFixture<CreateUploadContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUploadContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUploadContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
