import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';


import { QrCodeModalComponent } from './qr-code-modal.component';


class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('QrCodeModalComponent', () => {
  let component: QrCodeModalComponent;
  let fixture: ComponentFixture<QrCodeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeModalComponent ],
      imports: [SuiModule, RouterTestingModule],
      providers: [{ provide: Router, useClass: RouterStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit method and naviagte to search results page', inject([Router],
    (route) => {
        const dialcode = '51u4e';
        component.onSubmit(dialcode);
        expect(component.router.navigate).toHaveBeenCalledWith(['/get/dial/', dialcode]);
    }));

});
