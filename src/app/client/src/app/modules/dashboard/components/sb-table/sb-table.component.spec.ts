import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { SbTableComponent } from './sb-table.component';
import { mockData } from './sb-table.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

fdescribe('SbTableComponent', () => {
  let component: SbTableComponent;
  let fixture: ComponentFixture<SbTableComponent>;
  configureTestSuite();
  const resourceServiceMockData = {
    messages: {
     
    },
    frmelmnts: {
      lbl: {
        reportSummary: 'Report Summary',
        exportCsv:"export CSV",
        filters:"reset filters",
        chooseFilter:"Choose filters to view reports",

      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbTableComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      providers: [ { provide: ResourceService, useValue: resourceServiceMockData }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbTableComponent);
    component = fixture.componentInstance;
    component.rowsData = mockData.rowsData;
    component.columnConfig = mockData.columnConfig;
    component.filters = mockData.filters;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call loadTable', () => {
    component.loadTable();
    expect(component.rowsData).toBe(mockData.rowsData);
    expect(component.load).toBe(true);

  });
  it('should call reset', () => {
    component.ngAfterViewInit();
    expect(component.rowsData).toBe(mockData.rowsData);
    expect(component.load).toBe(true);

  });

});
