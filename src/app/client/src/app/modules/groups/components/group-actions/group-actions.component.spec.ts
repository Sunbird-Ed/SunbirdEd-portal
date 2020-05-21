import { By } from '@angular/platform-browser';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupActionsComponent } from './group-actions.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

describe('GroupActionsComponent', () => {
  let component: GroupActionsComponent;
  let fixture: ComponentFixture<GroupActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupActionsComponent ],
      imports: [SuiModule, CommonConsumptionModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
