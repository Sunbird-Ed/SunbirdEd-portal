import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadOfflineContentComponent } from './load-offline-content.component';

describe('LoadOfflineContentComponent', () => {
  let component: LoadOfflineContentComponent;
  let fixture: ComponentFixture<LoadOfflineContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadOfflineContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadOfflineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
