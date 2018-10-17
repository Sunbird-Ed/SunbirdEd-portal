import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratingOnComponent } from './collaborating-on.component';

describe('CollaboratingOnComponent', () => {
  let component: CollaboratingOnComponent;
  let fixture: ComponentFixture<CollaboratingOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratingOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratingOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
