import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyTreeComponent } from './fancy-tree.component';

describe('FancyTreeComponent', () => {
  let component: FancyTreeComponent;
  let fixture: ComponentFixture<FancyTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyTreeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.nodes = {
        id: '1',
        title: 'node1',
        children: [{
          id: '1.1',
          title: 'node1.1'
        }, {
          id: '1.2',
          title: 'node1.2',
          children: [
            {
              id: '1.2.1',
              title: 'node1.2.1'
            }]
        }]
    };
    component.options = {};
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
