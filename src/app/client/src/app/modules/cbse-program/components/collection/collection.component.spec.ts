import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService, UtilService, ToasterService } from '@sunbird/shared';
import { CollectionComponent, ChapterListComponent} from '../index';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { collectionComponentInput } from './collection.component.spec.data';
describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent, ChapterListComponent ],
      imports: [HttpClientTestingModule, CommonConsumptionModule, TelemetryModule.forRoot(),
        DynamicModule.withComponents([ChapterListComponent])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ConfigService, ToasterService, UtilService]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
