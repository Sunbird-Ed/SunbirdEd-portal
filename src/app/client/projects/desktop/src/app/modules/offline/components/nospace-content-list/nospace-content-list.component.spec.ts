import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NospaceContentListComponent } from './nospace-content-list.component';

describe('NospaceContentListComponent', () => {
  let component: NospaceContentListComponent;
  let fixture: ComponentFixture<NospaceContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NospaceContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NospaceContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
