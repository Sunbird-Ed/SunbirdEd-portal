import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FullPageModalComponent } from './full-page-modal.component';
import { configureTestSuite } from '@sunbird/test-util';

describe('FullPageModalComponent', () => {
  let component: FullPageModalComponent;
  let fixture: ComponentFixture<FullPageModalComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [ FullPageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
