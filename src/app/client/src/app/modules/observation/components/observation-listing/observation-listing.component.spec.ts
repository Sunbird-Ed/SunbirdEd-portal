import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationListingComponent } from './observation-listing.component';

xdescribe('ObservationListingComponent', () => {
  let component: ObservationListingComponent;
  let fixture: ComponentFixture<ObservationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
