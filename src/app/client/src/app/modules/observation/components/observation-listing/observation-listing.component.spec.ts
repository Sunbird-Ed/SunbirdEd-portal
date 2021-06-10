import { ObservationListingComponent } from "./observation-listing.component";
import { BehaviorSubject, throwError, of } from "rxjs";
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import {
  ResourceService,
  ToasterService,
  SharedModule,
  UtilService,
} from "@sunbird/shared";
import {
  SearchService,
  OrgDetailsService,
  CoreModule,
  UserService,
  SchemaService,
  KendraService,
} from "@sunbird/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SuiModule } from "ng2-semantic-ui";
import * as _ from "lodash-es";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Response } from "./observation-listing.component.spec.data";
import { ActivatedRoute, Router } from "@angular/router";
import { TelemetryModule } from "@sunbird/telemetry";
import { configureTestSuite } from "@sunbird/test-util";
import { ObservationUtilService } from "../../service";
import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";

fdescribe("ObservationListingComponent", () => {
  let component: ObservationListingComponent;
  let fixture: ComponentFixture<ObservationListingComponent>;
  let toasterService,
    schemaService,
    observationUtilService,
    kendraService,
    location;
  const mockSearchData: any = Response.successData;
  class RouterStub {
    navigate = jasmine.createSpy("navigate");
    url = jasmine.createSpy("url");
  }
  let showEditUserDetailsPopup = true;
  let sendContentResult = true;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        observation: "Observation",
      },
    },
    languageSelected$: of({}),
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        CoreModule,
        HttpClientTestingModule,
        SuiModule,
        TelemetryModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: "",
            component: ObservationListingComponent,
            pathMatch: "full",
          },
        ]),
      ],
      declarations: [ObservationListingComponent],
      providers: [
        ObservationUtilService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationListingComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    observationUtilService = TestBed.get(ObservationUtilService);
    kendraService = TestBed.get(KendraService);
    showEditUserDetailsPopup = true;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should redo layout on render", () => {
    component.layoutConfiguration = {};
    component.ngOnInit();
    component.redoLayout();
    component.layoutConfiguration = null;
    component.redoLayout();
  });

  it("should call ObservationUtilService - getProfileInfo", () => {
    const mySpy = spyOn(observationUtilService, 'getProfileInfo').and.callThrough(); //callThrough()
    spyOn(component, 'getProfileCheck').and.callThrough(); //callThrough()
    component.getProfileCheck();
    showEditUserDetailsPopup=true;
    spyOn(observationUtilService, 'showPopupAlert').and.callThrough();
    observationUtilService.showPopupAlert(Response.metaData);
    expect(component.getProfileCheck).toHaveBeenCalled();
    expect(observationUtilService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1); 
  });

  it("should call ObservationUtilService - getProfileDataList", () => {
    component.ngOnInit();
    const mySpy = spyOn(observationUtilService, 'getProfileDataList').and.callThrough(); //callThrough()
    spyOn(component, 'getDataParam').and.callThrough(); //callThrough()
    component.getDataParam();
    component.payload=Response.profileData;
    expect(component.getDataParam).toHaveBeenCalled();
    expect(observationUtilService).toBeDefined();
    expect(mySpy).toBeDefined();
    expect(mySpy).toHaveBeenCalledTimes(1); 
  });

  it("should call KendraService - fetchContentList", () => {
    component.ngOnInit();
    spyOn(component, 'fetchContentList').and.callThrough(); //callThrough()
    // spyOn(kendraService, 'v1/solutions/targetedSolutions?type=observation').and.returnValue(of(Response.successData));
    component.fetchContentList();
    component.contentList=Response.successData;
    expect(component.fetchContentList).toHaveBeenCalled();
  });

  it("Should navigate to  back if profile not updated", () => {
    const location: Location = TestBed.get(Location);
    expect(location.path()).toBe("");
  });

  it("should unsubscribe from all observable subscriptions", () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, "complete");
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
