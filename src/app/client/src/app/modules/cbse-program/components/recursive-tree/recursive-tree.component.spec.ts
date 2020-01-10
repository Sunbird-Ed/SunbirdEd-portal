import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecursiveTreeComponent } from './recursive-tree.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { recursiveTreeComponentInput } from './recursive-tree.component.spec.data';

import * as _ from 'lodash-es';

describe('RecursiveTreeComponent', () => {
  
  let fixture: ComponentFixture<RecursiveTreeComponent>;
  let component: RecursiveTreeComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SuiProgressModule, SuiAccordionModule],
      declarations: [ RecursiveTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveTreeComponent);
    component = fixture.componentInstance; 
    component.programContext = recursiveTreeComponentInput.programContext;
    component.sessionContext = recursiveTreeComponentInput.sessionContext;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' ADD Button should be false on component initialize', () => {
    expect(component.showAddresource).toBeFalsy();
  });

  it('should execute nodeMetaEmitter on Event', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'nodeMetaEmitter').and.callThrough();
    component.nodeMetaEmitter({sampleEvent:"NodeMetaEmit",action : 'SampleAdd'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
  
  it('should execute nodeMetaEmitter on Event for eventAction add to be true', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'nodeMetaEmitter').and.callThrough();
    component.nodeMetaEmitter({action : 'add'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should execute createResource on Event & collection', async(() => { 
    fixture.detectChanges();
    const spy = spyOn(component, 'createResource').and.callThrough();
    component.createResource({stopPropagation() {return null;}},'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('should execute deleteResource on Event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'deleteResource').and.callThrough();
    component.deleteResource({},'do_id=sampleContent_do_id','do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should execute moveResource on Event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'moveResource').and.callThrough();
    component.moveResource({},'do_id=sampleContent_do_id','do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should execute previewResource on Event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'previewResource').and.callThrough();
    component.previewResource({},'do_id=sampleContent_do_id','do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should execute menuClick on Event', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'menuClick').and.callThrough();
    component.menuClick({stopPropagation() {return undefined;},sampleEvent:"clicked"});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

});

