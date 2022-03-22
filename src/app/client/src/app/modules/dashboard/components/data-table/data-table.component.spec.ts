import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  configureTestSuite();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
