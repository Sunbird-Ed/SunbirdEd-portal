import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {resourceTemplateComponentInput} from './resource-template.data';
import { ResourceTemplateComponent } from './resource-template.component';
import { SuiModule } from 'ng2-semantic-ui';

describe('ResourceTemplateComponent', () => {
  let component: ResourceTemplateComponent;
  let fixture: ComponentFixture<ResourceTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [ ResourceTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTemplateComponent);
    component = fixture.componentInstance;
    component.resourceTemplateComponentInput = resourceTemplateComponentInput;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showButton should be false on component initialize', () => {
    expect(component.showButton).toBeFalsy();
  });

  it('templateList should be defined', () => {
    expect(component.templateList).toBeDefined();
  });

  it('should emit event with type -next- on handleSubmit method execution', () => {
    component.templateSelected = 'explanationContent';
    fixture.detectChanges();
    spyOn(component.templateSelection, 'emit');
    component.handleSubmit();
    // tslint:disable-next-line:max-line-length
    expect(component.templateSelection.emit).toHaveBeenCalledWith({type: 'next', template: 'explanationContent', templateDetails: resourceTemplateComponentInput.templateList[0]});
  });

  xit('should close modal after ngOnDestroy', () => {
    component.templateSelected = 'explanationContent';
    fixture.detectChanges();
    component.ngOnDestroy();
    setTimeout(() => {
      expect(document.getElementsByTagName('sui-modal')).toBeUndefined();
    }, 0);
  });
});
