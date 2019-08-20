import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import {ResourceService} from '@sunbird/shared';

import {AccountMergeModalComponent} from './account-merge-modal.component';
import {Router} from '@angular/router';
import {of as observableOf} from 'rxjs';
import { InterpolatePipe } from './../../pipes';

describe('AccountMergeModalComponent', () => {
  let component: AccountMergeModalComponent;
  let fixture: ComponentFixture<AccountMergeModalComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    languageSelected$: observableOf({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [AccountMergeModalComponent, InterpolatePipe],
      providers: [
        {provide: ResourceService, useValue: resourceBundle},
        {provide: Router, useClass: RouterStub}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMergeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
