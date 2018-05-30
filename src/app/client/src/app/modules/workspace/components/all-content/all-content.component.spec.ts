import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllContentComponent } from './all-content.component';

describe('AllContentComponent', () => {
  let component: AllContentComponent;
  let fixture: ComponentFixture<AllContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
