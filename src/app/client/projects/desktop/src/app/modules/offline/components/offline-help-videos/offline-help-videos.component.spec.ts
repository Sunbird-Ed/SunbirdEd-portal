import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineHelpVideosComponent } from './offline-help-videos.component';

xdescribe('OfflineHelpVideosComponent', () => {
  let component: OfflineHelpVideosComponent;
  let fixture: ComponentFixture<OfflineHelpVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineHelpVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHelpVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
