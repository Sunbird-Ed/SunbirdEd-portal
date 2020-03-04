import { of } from 'rxjs';
import { collectionData } from './toc-page.component.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TocPageComponent } from './toc-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('TocPageComponent', () => {
  let component: TocPageComponent;
  let fixture: ComponentFixture<TocPageComponent>;
  const ActivatedRouteStub = {
    params: of({
      collectionId: 'do_312352584359821312285'
    }),
    snapshot: {
      data: {
        telemetry: {
          env: 'content',
          pageid: 'play-collection',
          subtype: 'paginate'
        }
      },
    },
    queryParams: {
      params: {
        contentId: collectionData.collection.result.content.children[0].identifier,
      }
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TocPageComponent ],
      imports: [TelemetryModule.forRoot(), SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [{provide: ActivatedRoute, useValue: ActivatedRouteStub}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call onplayContent', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'OnPlayContent');
    spyOn(component, 'logTelemetry');
    const collection = collectionData.collection.result.content;
    component.collectionData = collection;
    component.tocCardClickHandler({data: collection.children[0], rollup: {}});
    expect(component.OnPlayContent).toHaveBeenCalledWith(collection.children[0], true);
    expect(component.logTelemetry).toHaveBeenCalledWith('content-inside-collection', {});
    expect(component.isContentPresent).toBeTruthy();
  });

  it('should change active mimeType filter', () => {
    spyOn(component, 'logTelemetry');
    expect(component.activeMimeTypeFilter[0]).toEqual('all');
    component.selectedFilter({data: {text: 'video', value: 'video'}});
    expect(component.activeMimeTypeFilter).toEqual('video');
    expect(component.logTelemetry).toHaveBeenCalledWith('video');
  });

  it('should call navigateToContent', () => {
    spyOn<any>(component, 'navigateToContent');
    const content = collectionData.collection.result.content.children[0];
    component.OnPlayContent(content, true);
    expect(component['navigateToContent']).toHaveBeenCalledWith(content);
  });

  it('show make isContentpresent false', () => {
    expect(component.isContentPresent).toBeTruthy();
    component.showNoContent({message: 'No Content Available'});
    expect(component.isContentPresent).toBeFalsy();
  });
});
