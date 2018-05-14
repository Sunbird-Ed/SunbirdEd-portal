import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedPopupComponent } from './published-popup.component';

describe('PublishedPopupComponent', () => {
  let component: PublishedPopupComponent;
  let fixture: ComponentFixture<PublishedPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
