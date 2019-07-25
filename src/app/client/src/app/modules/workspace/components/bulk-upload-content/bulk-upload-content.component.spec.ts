import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadContentComponent } from './bulk-upload-content.component';
import { SuiModule } from 'ng2-semantic-ui';
import { RouterTestingModule } from '@angular/router/testing';

describe('BulkUploadContentComponent', () => {
  let component: BulkUploadContentComponent;
  let fixture: ComponentFixture<BulkUploadContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, RouterTestingModule],
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
