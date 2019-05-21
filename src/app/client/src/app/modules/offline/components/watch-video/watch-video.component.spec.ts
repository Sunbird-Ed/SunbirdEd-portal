import { ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchVideoComponent } from './watch-video.component';
import { SuiModalModule } from 'ng2-semantic-ui';

xdescribe('WatchVideoComponent', () => {
  let component: WatchVideoComponent;
  let fixture: ComponentFixture<WatchVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WatchVideoComponent],
      imports: [SuiModalModule],
      providers: [ResourceService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
