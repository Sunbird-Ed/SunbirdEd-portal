import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { NoGroupResultComponent } from './no-group-result.component';

describe('NoGroupResultComponent', () => {
  let component: NoGroupResultComponent;
  let fixture: ComponentFixture<NoGroupResultComponent>;
  configureTestSuite();
  beforeEach(waitForAsync(() => {
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
