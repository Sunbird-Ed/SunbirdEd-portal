import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroupsListComponent } from './my-groups.component';

describe('MyGroupsListComponent', () => {
  let component: MyGroupsListComponent;
  let fixture: ComponentFixture<MyGroupsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
