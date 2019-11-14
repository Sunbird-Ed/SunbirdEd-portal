import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineFaqComponent } from './offline-faq.component';

xdescribe('OfflineFaqComponent', () => {
  let component: OfflineFaqComponent;
  let fixture: ComponentFixture<OfflineFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
