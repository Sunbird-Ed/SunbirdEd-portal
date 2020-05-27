import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGroupResultComponent } from './no-group-result.component';

describe('NoGroupResultComponent', () => {
  let component: NoGroupResultComponent;
  let fixture: ComponentFixture<NoGroupResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoGroupResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoGroupResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
