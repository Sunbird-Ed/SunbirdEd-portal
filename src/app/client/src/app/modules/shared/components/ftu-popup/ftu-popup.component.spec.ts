import { ResourceService } from './../../services/resource/resource.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtuPopupComponent } from './ftu-popup.component';

describe('FtuPopupComponent', () => {
  let component: FtuPopupComponent;
  let fixture: ComponentFixture<FtuPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtuPopupComponent ],
      providers: [ ResourceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
