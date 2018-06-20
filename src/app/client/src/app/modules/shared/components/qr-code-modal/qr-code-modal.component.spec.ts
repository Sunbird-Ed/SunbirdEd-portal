import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { QrCodeModalComponent } from './qr-code-modal.component';
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('QrCodeModalComponent', () => {
  let component: QrCodeModalComponent;
  let fixture: ComponentFixture<QrCodeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, RouterTestingModule, HttpClientModule, SharedModule.forRoot()],
      providers: [ConfigService, { provide: Router, useClass: RouterStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeModalComponent);
    component = fixture.componentInstance;
  });



  it('should call onSubmit method and naviagte to search results page', inject([Router],
    (route) => {
        const dialcode = '51u4e';
        const resourceService: any = TestBed.get(ResourceService);
        resourceService._instance = 'sunbird';
        component.onSubmit(dialcode);
        expect(component.router.navigate).toHaveBeenCalledWith(['/get/dial/', dialcode]);
    }));

});
