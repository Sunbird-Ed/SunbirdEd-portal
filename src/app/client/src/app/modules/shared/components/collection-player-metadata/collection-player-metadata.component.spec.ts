import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CollectionPlayerMetadataComponent } from './collection-player-metadata.component';
import { DateFormatPipe } from '../../pipes';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services';
import { CacheService } from 'ng2-cache-service';
describe('CollectionPlayerMetadataComponent', () => {
  let component: CollectionPlayerMetadataComponent;
  let fixture: ComponentFixture<CollectionPlayerMetadataComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ collectionId: 'LP_FT_TextBook2' })
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerMetadataComponent, DateFormatPipe],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
});
