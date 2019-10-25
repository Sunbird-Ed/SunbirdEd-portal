import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveTreeComponent } from './recursive-tree.component';

describe('RecursiveTreeComponent', () => {
  let component: RecursiveTreeComponent;
  let fixture: ComponentFixture<RecursiveTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecursiveTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
