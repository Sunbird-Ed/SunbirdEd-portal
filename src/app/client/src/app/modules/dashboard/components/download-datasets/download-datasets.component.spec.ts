import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDatasetsComponent } from './download-datasets.component';

describe('DownloadDatasetsComponent', () => {
  let component: DownloadDatasetsComponent;
  let fixture: ComponentFixture<DownloadDatasetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDatasetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
