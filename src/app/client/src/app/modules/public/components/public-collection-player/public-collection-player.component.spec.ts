import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionHierarchyAPI, ContentService, CoreModule } from '@sunbird/core';
import { PublicCollectionPlayerComponent } from './public-collection-player.component';
import { PublicPlayerService } from '../../services';

describe('PublicCollectionPlayerComponent', () => {
  let component: PublicCollectionPlayerComponent;
  let fixture: ComponentFixture<PublicCollectionPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicCollectionPlayerComponent],
      imports: [CoreModule, HttpClientTestingModule, RouterTestingModule],
      providers: [ContentService, PublicPlayerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCollectionPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
