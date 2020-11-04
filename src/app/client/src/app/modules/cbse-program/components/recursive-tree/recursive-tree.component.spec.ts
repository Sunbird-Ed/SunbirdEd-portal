import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecursiveTreeComponent } from './recursive-tree.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { recursiveTreeComponentInput } from './recursive-tree.component.spec.data';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import * as _ from 'lodash-es';

describe('RecursiveTreeComponent', () => {

  let fixture: ComponentFixture<RecursiveTreeComponent>;
  let component: RecursiveTreeComponent;
  let mockResponseData;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SuiProgressModule, CoreModule,
        SuiAccordionModule, TelemetryModule.forRoot(),
        HttpClientTestingModule],
      declarations: [ RecursiveTreeComponent ],
      providers: [ ConfigService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveTreeComponent);
    component = fixture.componentInstance;
    component.programContext = recursiveTreeComponentInput.programContext;
    component.sessionContext = recursiveTreeComponentInput.sessionContext;
    fixture.detectChanges();
    component.nodeMeta.subscribe((outputData) => {
      mockResponseData = outputData;
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add button should be false on component initialize', () => {
    expect(component.showAddresource).toBeFalsy();
  });

  it('should execute nodeMetaEmitter on event', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'nodeMetaEmitter').and.callThrough();
    component.nodeMetaEmitter({sampleEvent: 'NodeMetaEmit', action : 'SampleAdd'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'SampleAdd'}));
    });
  });

  it('should execute nodeMetaEmitter on event for eventAction add to be true', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'nodeMetaEmitter').and.callThrough();
    component.nodeMetaEmitter({action : 'add'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'add'}));
    });
  });

  it('should execute createResource on event & collection', async(() => {
    fixture.detectChanges();
    const spy = spyOn(component, 'createResource').and.callThrough();
    component.createResource({stopPropagation() {return null; }}, 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'add', collection: 'do_id=232323343434rff'}));
    });
  }));

  it('should execute deleteResource on event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'deleteResource').and.callThrough();
    component.deleteResource({}, 'sampleContent_do_id', 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      // tslint:disable-next-line:max-line-length
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'delete', content: 'sampleContent_do_id', collection: 'do_id=232323343434rff'}));
    });
  });

  it('should execute moveResource on event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'moveResource').and.callThrough();
    component.moveResource({}, 'sampleContent_do_id', 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      // tslint:disable-next-line:max-line-length
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'beforeMove', content: 'sampleContent_do_id', collection: 'do_id=232323343434rff'}));
    });
  });

  it('should execute previewResource on event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'previewResource').and.callThrough();
    component.previewResource({}, 'sampleContent_do_id', 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      // tslint:disable-next-line:max-line-length
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'preview', content: 'sampleContent_do_id', collection: 'do_id=232323343434rff'}));
    });
  });

  it('should execute menuClick on event', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'menuClick').and.callThrough();
    component.menuClick({stopPropagation() {return null; }, sampleEvent: 'clicked'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});

