import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FullPageModalComponent } from './full-page-modal.component';
import { configureTestSuite } from '@sunbird/test-util';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalWrapperComponent, ModalContentDirective } from './../modal-wrapper/modal-wrapper.component';
describe('FullPageModalComponent', () => {
  let component: FullPageModalComponent;
  let fixture: ComponentFixture<FullPageModalComponent>;
  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [ FullPageModalComponent, ModalWrapperComponent, ModalContentDirective]
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
