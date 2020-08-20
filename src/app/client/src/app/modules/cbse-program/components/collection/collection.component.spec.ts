import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService, ResourceService, ToasterService, UtilService, BrowserCacheTtlService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionComponent} from './collection.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { ProgramStageService } from '../../../program/services';
import { collectionComponentInput, collectionWithCard, searchCollectionResponse} from './collection.component.spec.data';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

const ContentServiceStub = {
  post() {
    return of( searchCollectionResponse );
  }
};

const activatedRouteStub = {
  data: of({
    config: {
      question_categories: [
        'vsa',
        'sa',
        'la',
        'mcq'
      ]
    }
  }),
  snapshot: {
    root: { firstChild: { data: { telemetry: { env: 'env' } } } },
    data: {
      telemetry: { env: 'env' }
    }
  }
};

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent ],
      imports: [HttpClientTestingModule,
               TranslateModule.forRoot({
                  loader: {
                    provide: TranslateLoader,
                    useClass: TranslateFakeLoader
                  }
                }),CoreModule, TelemetryModule.forRoot(), RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ConfigService,
        ToasterService,
        ResourceService,
        CacheService,
        BrowserCacheTtlService,
        UtilService,
        ContentService,
        ProgramStageService,
        {
          provide: ContentService,
          useValue: ContentServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    component.showError = false;
    component.collectionComponentInput = collectionComponentInput;
    component.userProfile = collectionComponentInput.userProfile;
    component.collectionComponentConfig = collectionComponentInput.config;
    component.programContext = collectionComponentInput.programContext;
    component.collectionsWithCardImage = collectionWithCard;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stageSubscription should get subcribe on component initialize', () => {
    expect(component.stageSubscription).toBeDefined();
  });

  it('should call changeView on stage change', () => {
    component.programStageService.getStage = jasmine.createSpy('getstage() spy').and.callFake(() => {
        return of({stages: []});
    });
    spyOn(component, 'changeView');
    component.ngOnInit();
    expect(component.changeView).toHaveBeenCalled();
  });

  it('getImplicitFilters should call filterByCollection and filter by code', () => {
    spyOn(component, 'filterByCollection');
    component.getImplicitFilters();
    expect(component.filterByCollection).toHaveBeenCalledWith(jasmine.any(Array), 'code', jasmine.any(Array));
  });

  it('after filter it should discard unwanted implicit code', () => {
    collectionComponentInput.config.config.filters.implicit.push({
      'code': 'class_unwanted',
      'defaultValue': 'class 10',
      'label': 'Class'
    });
    expect(_.includes(component.getImplicitFilters(), 'class_unwanted')).toBeFalsy();
  });

  it('should be less than or equal to the filters mentioned in config', () => {
    expect(component.filters.length).toBeLessThanOrEqual(collectionComponentInput.config.config.filters.implicit.length);
  });

  it('Object to key array', () => {
    const object = {
      a: 'test1',
      b: 'test2',
      c: false
    };
    const keyArray = ['a', 'b', 'c'];
    const keyArrayOfObject = component.objectKey(object);
    expect(keyArrayOfObject).toEqual(keyArray);
  });

  it('should filter textbook of same identifier with status Draft', () => {
    expect(_.includes(component.filterTextBook, {status: 'Review'})).toBeFalsy();
  });

  it('onSelect of gradeLevel filter', () => {
   component.setAndClearFilterIndex(2);
   expect(component.selectedIndex).toEqual(2);
   expect(component.activeFilterIndex).toEqual(2);
  });

  it('onDeselect of gradeLevel filter', () => {
    component.setAndClearFilterIndex(2); // To set filter
    component.setAndClearFilterIndex(2); // To clear filter
    expect(component.selectedIndex).toEqual(-1);
    expect(component.activeFilterIndex).toEqual(2);
   });

   it('collectionList should always be object', () => {
     expect(component.collectionList).toEqual(jasmine.any(Object));
   });

   it('should define chapterListInput value on click of collection', () => {
     const sampleEvent = {
       data: {
         name: 'sampleName',
         metaData: {
           identifier: 'do_sampleId'
         }
       }
     };
     let testData;
     component.isCollectionSelected.subscribe((eventData) => {
       testData = eventData;
     });
     component.collectionClickHandler(sampleEvent);
     expect(component.chapterListComponentInput).toEqual(jasmine.objectContaining({collection: sampleEvent.data}));
     expect(testData).toEqual(true);
   });

   it('can pass medium to filterCollectionList as filterValue', () => {
    component.filterCollectionList('Kannada', 'medium');
    expect(_.has(component.collectionList, 'Kannada')).toEqual(true); // As per the spec data
   });

});
