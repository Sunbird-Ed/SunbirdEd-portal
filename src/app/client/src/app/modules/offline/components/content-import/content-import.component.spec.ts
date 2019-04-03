import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentImportComponent } from './content-import.component';

describe('ContentImportComponent', () => {
  let component: ContentImportComponent;
  let fixture: ComponentFixture<ContentImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
