import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultComponent } from './no-result.component';
const data = {'message': ' ', 'messageText': ''};
describe('NoResultComponent', () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
