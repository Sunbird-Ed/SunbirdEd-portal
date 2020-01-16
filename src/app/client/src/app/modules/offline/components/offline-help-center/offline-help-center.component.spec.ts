import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineHelpCenterComponent } from './offline-help-center.component';

xdescribe('OfflineHelpCenterComponent', () => {
  let component: OfflineHelpCenterComponent;
  let fixture: ComponentFixture<OfflineHelpCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineHelpCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHelpCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
