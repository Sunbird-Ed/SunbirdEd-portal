import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbseComponent } from './cbse.component';

describe('CbseComponent', () => {
  let component: CbseComponent;
  let fixture: ComponentFixture<CbseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
