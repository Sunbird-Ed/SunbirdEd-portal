import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListComponent } from './activity-list.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('ActivityListComponent', () => {
  let component: ActivityListComponent;
  let fixture: ComponentFixture<ActivityListComponent>;
  let activatedRoute, router;

  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({});
    paramsMock = new BehaviorSubject<any>({ groupId: 'abcd12322', activityId: 'do_34534' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {},
      data: {
        telemetry: {}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'Please wait',
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityListComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), SuiModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(ActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getActivities');
    component.ngOnInit();
    expect(component.showLoader).toBe(true);
    expect(component.getActivities).toHaveBeenCalled();
  });

  it('should call getActivities', () => {
    component.getActivities();
    expect(component.showLoader).toBe(false);
    expect(component.activityList).toBeDefined();
  });

  it('should call openActivity', () => {
    const activity = {
      name: 'Class 5 English',
      identifier: 'do_123523212190',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3129265279296552961416/artifact/book_2_1491393340123.thumb_1577945304197.png',
      organisation: ['Pre-prod Custodian Organization'],
      subject: 'Social Science'
    };
    component.openActivity({}, activity);
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call getMenuData', () => {
    component.showMenu = false;
    const eventData = {
      event: {
        stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
      }
    };
    const member = {
      name: 'Footprints without Feet - English Supplementary Reader',
      identifier: 'do_1235232121343',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130298331259453441627/artifact/jefp1cc.thumb.jpg',
      organisation: ['Prod Custodian Organization'],
      subject: 'Social Science'
    };
    component.getMenuData(eventData, member);
    expect(component.selectedActivity).toEqual(member);
    expect(component.showMenu).toBe(true);
  });

  it('should call toggleModal', () => {
    component.toggleModal(true);
    expect(component.showModal).toEqual(true);
  });

  it('should call toggleModal', () => {
    component.toggleModal();
    expect(component.showModal).toEqual(false);
  });

  it('should call removeActivity', () => {
    component.activityList = [{
      name: 'Class 5 English',
      identifier: 'do_123523212190',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3129265279296552961416/artifact/book_2_1491393340123.thumb_1577945304197.png',
      organisation: ['Pre-prod Custodian Organization'],
      subject: 'Social Science'
    }, {
      name: 'India & Contemporary World II',
      identifier: 'do_123523212112',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31291521464536268819635/artifact/jess1cc_1575435434756.thumb.jpg',
      organisation: ['Prod Custodian Organization'],
      subject: 'Social Science'
    }, {
      name: 'Footprints without Feet - English Supplementary Reader',
      identifier: 'do_1235232121343',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130298331259453441627/artifact/jefp1cc.thumb.jpg',
      organisation: ['Prod Custodian Organization'],
      subject: 'Social Science'
    }];
    component.selectedActivity = component.activityList[2];
    spyOn(component, 'toggleModal');
    component.removeActivity();
    expect(component.activityList.length).toEqual(2);
    expect(component.toggleModal).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    component.showModal = true;
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.modal.deny).toHaveBeenCalled();
  });
});
