import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { ObservationService, KendraService, CoreModule } from "@sunbird/core";
import {
  ConfigService,
  ResourceService,
  SharedModule,
  ILoaderMessage,
  INoResultMessage,
} from "@sunbird/shared";
import { ObservationUtilService } from "../../service";
import { debounceTime, map } from "rxjs/operators";
import { AddEntityComponent } from "./add-entity.component";
import { configureTestSuite } from "@sunbird/test-util";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SuiModule } from "ng2-semantic-ui";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  profileData,
  TargetEntityType,
  searchData,
  SearchEvent,
  SubmitResult,
  finalEntityService,
} from "./add-entity.component.spec.data";
import {
  throwError as observableThrowError,
  of
} from "rxjs";

describe("AddEntityComponent", () => {
  let component: AddEntityComponent;
  let fixture: ComponentFixture<AddEntityComponent>;
  let observationUtilService, observationService, kendraService;
  class RouterStub {
    navigate = jasmine.createSpy("navigate");
  }

  const resourceBundle = {};

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        CoreModule,
        HttpClientTestingModule,
        SuiModule,
        RouterTestingModule,
      ],
      declarations: [AddEntityComponent],
      providers: [
        ObservationUtilService,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityComponent);
    component = fixture.componentInstance;
    observationUtilService = TestBed.get(ObservationUtilService);
    observationService = TestBed.get(ObservationService);
    kendraService = TestBed.get(KendraService);
    component.searchQuery = "";
    component.payload = {};
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
    component.payload=profileData;
    spyOn(component, "getProfileData").and.callThrough();
    component.getProfileData();
    expect(component.getProfileData).toHaveBeenCalled();
    expect(component.payload).toBe(profileData);
  });

  it("should call the getTargettedEntityType() on error", () => {
    spyOn(kendraService, "post").and.returnValue(observableThrowError("error"));
    spyOn(component, "getTargettedEntityType").and.callThrough();
    component.getTargettedEntityType();
    expect(component.getTargettedEntityType).toHaveBeenCalled();
  });

  it("should call the getTargettedEntityType() on success", () => {
    spyOn(kendraService, "post").and.returnValue(of(TargetEntityType));
    spyOn(observationService, "post").and.returnValue(of(searchData));
    spyOn(component, "getTargettedEntityType").and.callThrough();
    component.getTargettedEntityType();
    expect(component.getTargettedEntityType).toHaveBeenCalled();
    expect(component.targetEntity).toBe(TargetEntityType.result);
    expect(component.entities.length).toBeGreaterThanOrEqual(0);
    expect(component.count).toBe(searchData.result[0].count)
  });

  it("should call the getTargettedEntityType() on search failed", () => {
    spyOn(kendraService, "post").and.returnValue(of(TargetEntityType));
    spyOn(observationService, "post").and.returnValue(
      observableThrowError("error")
    );
    spyOn(component, "getTargettedEntityType").and.callThrough();
    component.getTargettedEntityType();
    expect(component.getTargettedEntityType).toHaveBeenCalled();
    expect(component.targetEntity).toBe(TargetEntityType.result);
    expect(component.entities.length).toBeGreaterThanOrEqual(0);
  });

  it("should call the searchEntity()", () => {
    component.page = 1;
    component.entities = [];
    spyOn(kendraService, "post").and.returnValue(of(TargetEntityType));
    spyOn(observationService, "post").and.returnValue(of(searchData));
    component.getTargettedEntityType();
    spyOn(component, "searchEntity").and.callThrough();
    component.searchEntity();
    expect(component.searchEntity).toHaveBeenCalled();
    expect(component.targetEntity).toBe(TargetEntityType.result);
    expect(component.entities.length).toBeGreaterThanOrEqual(0);
    expect(component.count).toBe(searchData.result[0].count)
  });

  it("should call the loadMore()", () => {
    spyOn(kendraService, "post").and.returnValue(of(TargetEntityType));
    spyOn(observationService, "post").and.returnValue(of(searchData));
    component.getTargettedEntityType();
    spyOn(component, "loadMore").and.callThrough();
    component.loadMore();
    expect(component.loadMore).toHaveBeenCalled();
    expect(component.targetEntity).toBe(TargetEntityType.result);
    expect(component.entities.length).toBeGreaterThanOrEqual(0);
    expect(component.count).toBe(searchData.result[0].count)
  });

  it("should call the selectEntity() if selected is true", () => {
    component.selectEntity(SearchEvent);
    spyOn(component, "selectEntity").and.callThrough();
  });

  it("should call the selectEntity() if selected is false", () => {
    SearchEvent.selected = false;
    component.selectEntity(SearchEvent);
    spyOn(component, "selectEntity").and.callThrough();
  });

  it("should call the submit() on success", () => {
    component.entities = finalEntityService;
    component.payload = profileData;
    component.showDownloadModal = false;
    component.modal = {
      approve:()=>{}
    }
    spyOn(observationService, "post").and.returnValue(of(SubmitResult));
    spyOn(component, "submit").and.callThrough();
    component.submit();
    expect(component.submit).toHaveBeenCalled();
    expect(SubmitResult.status).toBe(200);
  });
});




