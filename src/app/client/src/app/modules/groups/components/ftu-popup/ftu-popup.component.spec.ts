import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { FtuPopupComponent } from './ftu-popup.component';
import { SlickModule } from 'ngx-slick';
import { SuiModalModule } from 'ng2-semantic-ui';
describe('FtuPopupComponent', () => {
  let component: FtuPopupComponent;
  let fixture: ComponentFixture<FtuPopupComponent>;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        groupWelcomeTitle: 'Welcome to groups',
      },
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtuPopupComponent ],
      imports: [HttpClientModule, SlickModule, SuiModalModule, SharedModule.forRoot()],
      providers: [ { provide: ResourceService, useValue: resourceBundle }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });
});
