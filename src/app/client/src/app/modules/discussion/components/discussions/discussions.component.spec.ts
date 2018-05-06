import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionsComponent } from './discussions.component';

describe('DiscussionsComponent', () => {
  let component: DiscussionsComponent;
  let fixture: ComponentFixture<DiscussionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
