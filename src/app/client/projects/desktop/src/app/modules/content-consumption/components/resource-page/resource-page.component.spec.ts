import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePageComponent } from './resource-page.component';

xdescribe('ResourcePageComponent', () => {
  let component: ResourcePageComponent;
  let fixture: ComponentFixture<ResourcePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
