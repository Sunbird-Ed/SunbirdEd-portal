import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { ConfigService, ResourceService, ToasterService, SharedModule, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { CollectionComponent, ChapterListComponent} from '../index';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
// import { collectionComponentInput, collectionWithCard , collectionList, searchCollectionResponse} from './collection.component.spec.data';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

// const ContentServiceStub = {
//   post() {
//     return of( searchCollectionResponse );
//   }
// };

xdescribe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent, ChapterListComponent ],
      imports: [HttpClientTestingModule, CommonConsumptionModule, TelemetryModule.forRoot(),
        DynamicModule.withComponents([CollectionComponent])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ConfigService,
        ToasterService,
        ResourceService,
        CacheService,
        BrowserCacheTtlService,
        UtilService,
        ContentService,
        // {
        //   provide: ContentService,
        //   useValue: ContentServiceStub
        // }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should execute filters on collection', () => {
    spyOn(component, 'getCollectionCard');
    component.ngOnInit();
    expect(component.getCollectionCard).toHaveBeenCalled();
  });

  xit('should execute filter collection without parameter', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList();
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  xit('should execute filter collection with only filterValue', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList('Kindergarten');
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  xit('should execute filter collection with only filterBy', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList('', 'gradeLevel');
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  xit('should execute filter collection with filterValue and filterBy', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList('Kindergarten', 'gradeLevel');
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  xit('filterByCollection() should execute filter on filter collection with different param', () => {
    spyOn(component, 'filterByCollection');
    component.filterByCollection(component.collectionsWithCardImage, 'gradeLevel', ['grade 1']);
    expect(component.filterByCollection).toBeDefined();
  });

  xit('filterCollectionList() should execute filter on filter collection', () => {
    spyOn(component, 'filterByCollection');
    component.filterCollectionList('Kindergarten', 'gradeLevel');
    expect(component.filterByCollection).toHaveBeenCalled();
  });

  xit('filterByCollection() should execute filter on filter collection', () => {
    spyOn(component, 'filterByCollection');
    component.filterByCollection(component.collectionsWithCardImage, 'gradeLevel', ['Kindergarten']);
    expect(component.filterByCollection).toBeDefined();
  });

  xit('should execute group collection on filter', () => {
    const groupedCollectionList = component.groupCollectionList();
    expect(groupedCollectionList['Math']).toBeTruthy();
    expect(groupedCollectionList['English']).not.toBeTruthy();
    expect(groupedCollectionList['Hindi']).toBeTruthy();
  });

  xit('Object to key array', () => {
    const object = {
      a: 'test1',
      b: 'test2',
      c: false
    };
    const keyArray = ['a', 'b', 'c'];
    const keyArrayOfObject = component.objectKey(object);
    expect(keyArrayOfObject).toEqual(keyArray);
  });

  xit('Should check stage', () => {
    spyOn(component, 'filterByCollection');
    const filterCollection = component.filterByCollection(component.collectionsWithCardImage, 'Kindergarten', ['gradeLevel']);
    expect(filterCollection).not.toEqual('');
  });
});
