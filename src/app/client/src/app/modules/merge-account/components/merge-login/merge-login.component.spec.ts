import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';

import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf} from 'rxjs';

import { MergeLoginComponent } from './merge-login.component';

describe('MergeLoginComponent', () => {
  let component: MergeLoginComponent;
  let fixture: ComponentFixture<MergeLoginComponent>;
  const fakeActivatedRoute = {
    'queryParams': observableOf({isMergeSuccess: false, redirectUri: '/learn'}),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [MergeLoginComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
