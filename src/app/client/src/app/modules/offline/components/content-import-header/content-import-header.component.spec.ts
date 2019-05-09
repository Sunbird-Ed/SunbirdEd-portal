import { ContentImportComponent } from './../content-import/content-import.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentImportHeaderComponent } from './content-import-header.component';

describe('ContentImportHeaderComponent', () => {
  let component: ContentImportHeaderComponent;
  let fixture: ComponentFixture<ContentImportHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentImportHeaderComponent, ContentImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
