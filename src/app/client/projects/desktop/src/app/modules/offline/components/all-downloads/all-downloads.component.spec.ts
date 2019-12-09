import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDownloadsComponent } from './all-downloads.component';

describe('AllDownloadsComponent', () => {
  let component: AllDownloadsComponent;
  let fixture: ComponentFixture<AllDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
