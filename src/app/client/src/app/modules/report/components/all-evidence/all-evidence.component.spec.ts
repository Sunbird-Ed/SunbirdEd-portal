import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEvidenceComponent } from './all-evidence.component';

xdescribe('AllEvidenceComponent', () => {
  let component: AllEvidenceComponent;
  let fixture: ComponentFixture<AllEvidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEvidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
