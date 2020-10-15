import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseImagePopupComponent } from './browse-image-popup.component';

describe('BrowseImagePopupComponent', () => {
  let component: BrowseImagePopupComponent;
  let fixture: ComponentFixture<BrowseImagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseImagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
