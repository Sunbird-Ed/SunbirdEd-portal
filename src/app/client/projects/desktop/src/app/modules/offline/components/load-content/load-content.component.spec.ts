import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContentComponent } from './load-content.component';

xdescribe('LoadContentComponent', () => {
  let component: LoadContentComponent;
  let fixture: ComponentFixture<LoadContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
