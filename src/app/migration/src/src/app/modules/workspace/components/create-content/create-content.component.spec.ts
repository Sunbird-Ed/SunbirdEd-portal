import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContentComponent } from './create-content.component';

describe('CreateContentComponent', () => {
  let component: CreateContentComponent;
  let fixture: ComponentFixture<CreateContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
