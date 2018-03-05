import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCardComponent } from './content-card.component';

describe('ContentCardComponent', () => {
  let component: ContentCardComponent;
  let fixture: ComponentFixture<ContentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
