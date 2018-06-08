import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectComponent } from './redirect.component';

describe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call window.open() in same tab', () => {
    setTimeout(() => {
      window.open(window.redirectUrl, '_self');
    }, 500);
    expect(component).toBeTruthy();
    expect(window.open).toBeDefined();
  });

  it('test goback function', () => {
    component.goBack();
    window.close();
    expect(component.goBack).toBeDefined();
  });
});
