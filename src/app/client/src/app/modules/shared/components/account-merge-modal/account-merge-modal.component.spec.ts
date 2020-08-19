import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import {ResourceService} from '@sunbird/shared';
import {TelemetryModule} from '@sunbird/telemetry';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import {AccountMergeModalComponent} from './account-merge-modal.component';
import {of as observableOf} from 'rxjs';
import {InterpolatePipe} from './../../pipes';

describe('AccountMergeModalComponent', () => {
  let component: AccountMergeModalComponent;
  let fixture: ComponentFixture<AccountMergeModalComponent>;

  const resourceBundle = {
    languageSelected$: observableOf({})
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, TelemetryModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AccountMergeModalComponent, InterpolatePipe],
      providers: [
        {provide: ResourceService, useValue: resourceBundle}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMergeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call initiateMerge and throwerror', () => {
    const returnData = { responseCode: 'FAILED'};
    spyOn(component['http'], 'get').and.returnValue(observableOf(returnData));
    spyOn(component, 'closeModal');
    component.initiateMerge();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
