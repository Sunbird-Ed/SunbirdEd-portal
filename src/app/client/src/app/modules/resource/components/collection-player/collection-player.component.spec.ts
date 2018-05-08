import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPlayerComponent } from './collection-player.component';
import { CoursesService, PlayerService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowScrollService, ConfigService, SharedModule } from '../../../shared';
import { CollectionTreeComponent, AppLoaderComponent, PlayerComponent, FancyTreeComponent } from '../../../shared/components';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CollectionPlayerComponent', () => {
  let component: CollectionPlayerComponent;
  let fixture: ComponentFixture<CollectionPlayerComponent>;

  beforeEach(async(() => {
    const fakeActivatedRoute = {
      snapshot: { data: {} }
    } as ActivatedRoute;

    TestBed.configureTestingModule({
      declarations: [ CollectionPlayerComponent ],
      imports: [ SuiModule, HttpClientTestingModule, CoreModule, SharedModule, RouterTestingModule ],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
