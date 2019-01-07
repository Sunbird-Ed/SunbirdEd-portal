import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactDetailsComponent } from './update-contact-details.component';

xdescribe('UpdateContactDetailsComponent', () => {
  let component: UpdateContactDetailsComponent;
  let fixture: ComponentFixture<UpdateContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateContactDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
