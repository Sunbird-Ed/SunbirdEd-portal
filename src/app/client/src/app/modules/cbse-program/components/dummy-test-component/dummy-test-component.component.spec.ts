import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyTestComponentComponent } from './dummy-test-component.component';

describe('DummyTestComponentComponent', () => {
  let component: DummyTestComponentComponent;
  let fixture: ComponentFixture<DummyTestComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyTestComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyTestComponentComponent);
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
