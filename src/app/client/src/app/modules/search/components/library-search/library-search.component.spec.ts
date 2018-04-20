import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySearchComponent } from './library-search.component';

describe('LibrarySearchComponent', () => {
  let component: LibrarySearchComponent;
  let fixture: ComponentFixture<LibrarySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrarySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
