import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { SbTableComponent } from './sb-table.component';
import { mockData } from './sb-table.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

describe('SbTableComponent', () => {
  let component: SbTableComponent;
  let fixture: ComponentFixture<SbTableComponent>;
  configureTestSuite();
  const resourceServiceMockData = {
    messages: {
     
    },
    frmelmnts: {
      lbl: {
        exportCsv:"Export CSV",
        filters:"Reset Filters",
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call loadTable', () => {

    component.rowsData = mockData.rowsData;
    component.config = mockData.config;
    component.loadTable();
    expect(component.data).toEqual( { values:mockData.rowsData });
  
  });

});
