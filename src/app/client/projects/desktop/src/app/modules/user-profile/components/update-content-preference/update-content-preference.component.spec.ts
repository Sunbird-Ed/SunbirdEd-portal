import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContentPreferenceComponent } from './update-content-preference.component';

xdescribe('UpdateContentPreferenceComponent', () => {
  let component: UpdateContentPreferenceComponent;
  let fixture: ComponentFixture<UpdateContentPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateContentPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContentPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
