import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionPlayerMetadataComponent } from './collection-player-metadata.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DateFormatPipe } from './../../pipes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayerService, UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('CollectionPlayerMetadataComponent', () => {
  let component: CollectionPlayerMetadataComponent;
  let fixture: ComponentFixture<CollectionPlayerMetadataComponent>;
  const fakeActivatedRoute = {
    'params': Observable.from([{ collectionId: 'LP_FT_TextBook2' }])
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerMetadataComponent],
      imports: [CoreModule, HttpClientTestingModule, RouterTestingModule],
      providers: [PlayerService, UserService, LearnerService, ContentService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
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
