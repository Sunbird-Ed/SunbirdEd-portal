import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McqCreationComponent } from './mcq-creation.component';

describe('McqCreationComponent', () => {
  let component: McqCreationComponent;
  let fixture: ComponentFixture<McqCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McqCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
