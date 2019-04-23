import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunbirdFooterComponent } from './sunbird-footer.component';

describe('SunbirdFooterComponent', () => {
  let component: SunbirdFooterComponent;
  let fixture: ComponentFixture<SunbirdFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SunbirdFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
