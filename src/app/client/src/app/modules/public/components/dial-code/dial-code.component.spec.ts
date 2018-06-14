import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { SearchService } from '@sunbird/core';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialCodeComponent } from './dial-code.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './dial-code.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
describe('DialCodeComponent', () => {
  let component: DialCodeComponent;
  let fixture: ComponentFixture<DialCodeComponent>;
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0007': 'Search for something else',
        'm0006': 'No result',
        'm0112': 'Content coming soon'
      },
      'fmsg': {
        'm0049': 'Fetching serach result failed'
      }
    }
  };
  const fakeActivatedRoute = {
    'params': Observable.from([{ dialCode: '61U24C' }]),
    'queryParams': Observable.from([]),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot(), TelemetryModule.forRoot(),  Ng2IziToastModule],
      declarations: [DialCodeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialCodeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should return matching contents for valid dialcode query', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(Response.successData));
    component.searchDialCode();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
  });
  it('should return appropriate message on no contents', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.of(Response.noData));
    component.searchDialCode();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchResults).toEqual([]);
  });
  it('should return appropriate failure message on error throw', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'compositeSearch').and.callFake(() => Observable.throw(new Error('Server error')));
    component.searchDialCode();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchResults).toEqual([]);
  });
  it('should navigate to dialcode search when user enters data', () => {
    const route = TestBed.get(Router);
    component.searchKeyword = '61U24C';
    component.navigateToSearch();
    fixture.detectChanges();
    expect(route.navigate).toHaveBeenCalledWith(['/get/dial', component.searchKeyword]);
  });
  it('should navigate to content player page for resource content types', () => {
    const route = TestBed.get(Router);
    const item = Response.event;
    item.data.metaData.mimeType = 'application/vnd.ekstep.content';
    component.getEvent(item);
    fixture.detectChanges();
    expect(route.navigate).toHaveBeenCalledWith(['play/content', item.data.metaData.identifier]);
  });
  it('should navigate to collection player page for collection types', () => {
    const route = TestBed.get(Router);
    const item = Response.event;
    item.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
    component.getEvent(item);
    expect(route.navigate).toHaveBeenCalledWith(['play/collection', item.data.metaData.identifier]);
  });
});
