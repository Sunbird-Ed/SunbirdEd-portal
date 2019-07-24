import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadContentComponent } from './bulk-upload-content.component';

describe('BulkUploadContentComponent', () => {
  let component: BulkUploadContentComponent;
  let fixture: ComponentFixture<BulkUploadContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
