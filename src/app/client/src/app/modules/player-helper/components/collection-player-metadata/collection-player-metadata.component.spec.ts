import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CollectionPlayerMetadataComponent } from './collection-player-metadata.component';
import { DateFormatPipe, InterpolatePipe } from '@sunbird/shared';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { Response } from './collection-player-metadata.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
describe('CollectionPlayerMetadataComponent', () => {
  let component: CollectionPlayerMetadataComponent;
  let fixture: ComponentFixture<CollectionPlayerMetadataComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ collectionId: 'LP_FT_TextBook2' })
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerMetadataComponent, DateFormatPipe, InterpolatePipe],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
         }
      })],
      providers: [ResourceService, ConfigService, CacheService,
        BrowserCacheTtlService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should get collection id from activated route', () => {
    fixture.detectChanges();
    expect(component.collectionId).toBe('LP_FT_TextBook2');
  });

  it('should open popup on click of show content credits', () => {
    spyOn(component, 'showContentCreditsPopup').and.callThrough();
    component.showContentCreditsPopup();
    fixture.detectChanges();
    expect(component.showContentCreditsModal).toBeTruthy();
  });
  it('should get the interact object for telemetry', () => {
    component.collectionId = Response.metaData.identifier;
    component.metaData = Response.metaData;
    const result = component.getTelemetryInteractObject();
    expect(result).toEqual({id: 'do_112485752378662912157', type: 'Resource', ver: '1.0'});
  });
  it('should get the interact edata for telemetry', () => {
    const result = component.getTelemetryInteractEdata({id: 'button-click'});
    expect(result).toEqual({id: 'button-click', type: 'click', pageid: 'collection-player'});
  });
});
