import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { CollectionComponent, ChapterListComponent} from '../index';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicDataService, ContentService } from '@sunbird/core';
// tslint:disable-next-line:max-line-length
import { collectionComponentInput, programSession, collectionWithCard , collectionList, searchCollectionRequest, searchCollectionResponse} from './collection.component.spec.data';
import { CbseProgramService } from '../../services';
import { ProgramStageService } from '../../../program/services';
import { HttpModule, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const ContentServiceStub = {
  post() {
    return of( searchCollectionResponse );
  }
};

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent, ChapterListComponent ],
      imports: [HttpClientTestingModule, CommonConsumptionModule, TelemetryModule.forRoot(),
        DynamicModule.withComponents([ChapterListComponent])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ConfigService,
        ToasterService,
        UtilService,
        ContentService,
        {
          provide: ContentService,
          useValue: ContentServiceStub
        }
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    component.collectionComponentInput = collectionComponentInput;
    component.userProfile = collectionComponentInput.userProfile;
    component.collectionComponentConfig = collectionComponentInput.config;
    component.programContext = collectionComponentInput.programContext;
    component.collectionsWithCardImage = collectionWithCard;
    component.collectionList = collectionList;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should execute search collection', () => {
    spyOn(component, 'searchCollection');
    component.ngOnInit();
    expect(component.searchCollection).toHaveBeenCalled();
  });

  it('should execute filter collection without parameter', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList();
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  it('should execute filter collection withonly filterValue', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList('Kindergarten');
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  it('should execute filter collection withonly filterBy', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList('', 'gradeLevel');
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  it('should execute filter collection with filterValue and filterBy', () => {
    spyOn(component, 'filterCollectionList');
    component.filterCollectionList('Kindergarten', 'gradeLevel');
    expect(component.filterCollectionList).toHaveBeenCalled();
  });

  it('filterByCollection() should execute filter on filter collection with diffrent param', () => {
    spyOn(component, 'filterByCollection');
    component.filterByCollection(component.collectionsWithCardImage, 'gradeLevel', ['grade 1']);
    expect(component.filterByCollection).toBeDefined();
  });

  it('filterCollectionList() should execute filter on filter collection', () => {
    spyOn(component, 'filterByCollection');
    component.filterCollectionList('Kindergarten', 'gradeLevel');
    expect(component.filterByCollection).toHaveBeenCalled();
  });

  it('filterByCollection() should execute filter on filter collection', () => {
    spyOn(component, 'filterByCollection');
    component.filterByCollection(component.collectionsWithCardImage, 'gradeLevel', ['Kindergarten']);
    expect(component.filterByCollection).toBeDefined();
  });

  it('should execute group collection on filter', () => {
    const groupedCollectionList = component.groupCollectionList();
    expect(groupedCollectionList['Math']).toBeTruthy();
    expect(groupedCollectionList['English']).not.toBeTruthy();
    expect(groupedCollectionList['Hindi']).toBeTruthy();
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

  it('Should check stage', () => {
    spyOn(component, 'filterByCollection');
    const filterCollection = component.filterByCollection(component.collectionsWithCardImage, 'Kindergarten', ['gradeLevel']);
    // console.log(filterCollection);
    expect(filterCollection).not.toEqual('');
    // tslint:disable-next-line:no-console
    // console.info(filterCollection);
    // expect(filterCollection).toEqual(collectionWithCard);
  });

  // functional element for filters
  // it('functionl test', () => {
  //   component.ngOnInit();
  //   const subjuctTabs = fixture.debugElement.query(By.css('.state-medium-container__medium'));
  //   expect(subjuctTabs).toBeDefined();
  // });

  // it('functionl test', () => {
  //   component.ngOnInit();
  //   const gradeLevelTabs = fixture.debugElement.query(By.css('.carousel'));
  //   expect(gradeLevelTabs).toBeDefined();
  // });
});

