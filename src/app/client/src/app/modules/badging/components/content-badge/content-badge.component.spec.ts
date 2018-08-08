
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentBadgeComponent } from './content-badge.component';
import { SuiModule } from 'ng2-semantic-ui';
import { UserService, BadgesService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule} from '@sunbird/shared';
import { mockResponse } from './content-badge.component.spec.data';
import { ContentBadgeService } from './../../services';
import * as _ from 'lodash';
describe('ContentBadgeComponent', () => {
  let component: ContentBadgeComponent;
  let fixture: ComponentFixture<ContentBadgeComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    'params': observableOf({ collectionId: 'Test_Textbook2_8907797' })
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentBadgeComponent],
      imports: [SuiModule, CoreModule.forRoot(), SharedModule.forRoot(), HttpClientTestingModule],
      providers: [ContentBadgeService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should contain badgeClassName in response', () => {
    component.data = mockResponse.badgeData;
    expect(component.data[0]['badgeClassName']).toBeDefined();
  });
  it('should not contain badgeClassName in response', () => {
    component.data = undefined;
    expect(component.data).not.toBeDefined();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
  it('should show badgeClassImage while passing badgeData', () => {
    component.data = mockResponse.badgeData;
    fixture.detectChanges();
    const badgesElm = fixture.nativeElement.querySelector('div .mini');
    expect(component.data).toBeDefined();
    expect(component.data.length).toBeGreaterThanOrEqual(1);
    component.data.forEach((data) => {
      expect( _.has(data, 'badgeClassImage')).toBeTruthy();
      expect( _.has(data, 'badgeClassImage')).toBeDefined();
    });
    expect(badgesElm.src).toContain(mockResponse.badgeData[0].badgeClassImage);
  });
});
