import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService } from '@sunbird/shared';
import { ExploreGroupComponent } from './explore-group.component';
import { configureTestSuite } from '@sunbird/test-util';

describe('ExploreGroupComponent', () => {
  let component: ExploreGroupComponent;
  let fixture: ComponentFixture<ExploreGroupComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreGroupComponent ],
      providers: [ ResourceService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
