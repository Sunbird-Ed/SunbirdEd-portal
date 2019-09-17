import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';

import {SsoMergeConfirmationComponent} from './sso-merge-confirmation.component';
import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf} from 'rxjs';
import {ResourceService} from '@sunbird/shared';

describe('SsoMergeConfirmationComponent', () => {
  let component: SsoMergeConfirmationComponent;
  let fixture: ComponentFixture<SsoMergeConfirmationComponent>;
  const resourceBundle = {
    languageSelected$: observableOf({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [SsoMergeConfirmationComponent],
      providers: [
        {provide: ResourceService, useValue: resourceBundle},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoMergeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
