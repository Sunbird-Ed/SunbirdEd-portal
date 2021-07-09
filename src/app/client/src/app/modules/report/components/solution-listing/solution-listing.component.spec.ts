import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule,ResourceService } from "@sunbird/shared";
import { SolutionListingComponent } from "./solution-listing.component";
import { CoreModule, ObservationService,UserService } from "@sunbird/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SuiModule } from "ng2-semantic-ui-v9";
import { TelemetryModule } from "@sunbird/telemetry";
import { RouterTestingModule } from "@angular/router/testing";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ObservationUtilService } from "../../../observation/service";
import {
  ObservationData,
  profileData,
  EntityClick,
  ModalEventData
} from "./solution-listing.component.spec.data";
import { of as observableOf, throwError as observableThrowError, of, observable } from "rxjs";
import {EntityListComponent} from '../entity-list/entity-list.component'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

describe("SolutionListingComponent", () => {
  let component: SolutionListingComponent;
  let fixture: ComponentFixture<SolutionListingComponent>;
  let observationUtilService, observationService,userService;

  const resourceBundle = {
    messages:{
      fmsg:{
        m0088:"Please wait"
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        CoreModule,
        HttpClientTestingModule,
        SuiModule,
        DataTablesModule,
        FormsModule,
        ReactiveFormsModule,
        TelemetryModule.forRoot(),
        RouterTestingModule,
        InfiniteScrollModule
      ],
      declarations: [SolutionListingComponent,EntityListComponent],
      providers:[ { provide: ResourceService, useValue: resourceBundle },]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionListingComponent);
    observationUtilService = TestBed.get(ObservationUtilService);
    observationService = TestBed.get(ObservationService);
    userService = TestBed.get(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngonInit()", () => {
    spyOn(component, "ngOnInit").and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });


  it("should call ObservationUtilService - getProfileData", () => {
    spyOn(observationUtilService, "getProfileDataList").and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(observationService, "post").and.returnValue(of(ObservationData));
    component.getSolutions();
    component.payload = profileData;
    spyOn(component, "getProfileData").and.callThrough();
    component.getProfileData();
    expect(component.getProfileData).toHaveBeenCalled();
    expect(component.payload).toBe(profileData);
    expect(component.solutionList.length).toBeGreaterThanOrEqual(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });


  it("should call the getDataByEntity() has data", () => {
    spyOn(observationUtilService, "getProfileDataList").and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(observationService, "post").and.returnValue(of(ObservationData));
    component.getSolutions();
    component.payload = profileData;
    component.getProfileData();
    spyOn(component, "getDataByEntity").and.callThrough();
    component.getDataByEntity(EntityClick);
    expect(component.getDataByEntity).toHaveBeenCalled();
    expect(component.solutionList.length).toBeGreaterThanOrEqual(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });


  it("should call the goToReports()", () => {
    spyOn(component,"goToReports").and.callThrough();
    component.goToReports(ObservationData.result.data[0]);
    expect(component.goToReports).toHaveBeenCalled();
  });

  it("should call the navigateToPage for pagination", () => {
    component.navigateToPage(1);
    spyOn(observationUtilService, "getProfileDataList").and.callFake(() => {
      return Promise.resolve(profileData);
    });
    spyOn(observationService, "post").and.returnValue(of(ObservationData));
    component.getSolutions();
    component.payload = profileData;
    component.getProfileData();
    spyOn(component, "navigateToPage").and.callThrough;
    expect(component.solutionList.length).toBeGreaterThanOrEqual(0);
    expect(component.filters.length).toBeGreaterThanOrEqual(0);
  });

  it("should call the modalClose when isRubricDriven is false", () => {
    component.modalClose(ModalEventData);
    spyOn(component,"modalClose").and.callThrough();
  });

  it("should call the modalClose when isRubricDriven is true", () => {
    ModalEventData.value.solutionDetail.isRubricDriven=true;
    component.modalClose(ModalEventData);
    spyOn(component,"modalClose").and.callThrough();
  });

  it("should call the goToEntityList to open modal", () => {
    spyOn(component,"goToEntityList").and.callThrough();
    component.goToEntityList(ObservationData.result[0]);
    expect(component.goToEntityList).toHaveBeenCalled();
  });

});
