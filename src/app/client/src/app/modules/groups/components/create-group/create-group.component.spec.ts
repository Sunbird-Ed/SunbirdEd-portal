import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateGroupComponent } from './create-group.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [CreateGroupComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
  });
  it('Should init ngOnit', () => {
    component.ngOnInit();
  });

});
