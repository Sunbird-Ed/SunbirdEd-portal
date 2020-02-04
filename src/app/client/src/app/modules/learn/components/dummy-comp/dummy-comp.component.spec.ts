import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyCompComponent } from './dummy-comp.component';

describe('DummyCompComponent', () => {
  let component: DummyCompComponent;
  let fixture: ComponentFixture<DummyCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign dummyTestVariable', () => {
    expect(component.dummyTestVariable).toEqual('dummyValue');
  });

  it('should call dummyMethod', () => {
    spyOn(component, 'dummyMethod');
    component.ngOnInit();
    expect(component.dummyMethod).toHaveBeenCalled();
  });
});
