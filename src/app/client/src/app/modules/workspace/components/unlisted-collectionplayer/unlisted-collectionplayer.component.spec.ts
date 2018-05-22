import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionHierarchyAPI, ContentService, CoreModule } from '@sunbird/core';
import { UnlistedCollectionplayerComponent } from './unlisted-collectionplayer.component';
import { PublicPlayerService } from '../../../public/services';

describe('UnlistedCollectionplayerComponent', () => {
  let component: UnlistedCollectionplayerComponent;
  let fixture: ComponentFixture<UnlistedCollectionplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnlistedCollectionplayerComponent],
      imports: [CoreModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ContentService, PublicPlayerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlistedCollectionplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
