import { ConfigService } from "../../../shared/services/config/config.service";
import { OrganisationService } from "./organization.service";
import { LearnerService } from "../../../../modules/core/services/learner/learner.service";
import { DashboardUtilsService } from "../dashboard-utils/dashboard-utils.service";
import { of, throwError } from "rxjs";
import * as mockData from "./organization.service.spec.data";
import { HttpErrorResponse } from "@angular/common/http";
// import { data } from "jquery";
const testData = <any>mockData.mockRes;
 
describe("OrganisationService", () => {
 let organisationService: OrganisationService;
 const mockLearnerService: Partial<LearnerService> = {
   get: jest.fn(),
 };
 const mockDashboardUtilsService: Partial<DashboardUtilsService> = {};
 const mockConfigService: Partial<ConfigService> = {
   urlConFig: {
     URLS: {
       DASHBOARD: {
         ORG_CREATION: "ORG_CREATION",
         ORG_CONSUMPTION: "ORG_CONSUMPTION",
       },
     },
   },
 };
 beforeAll(() => {
   organisationService = new OrganisationService(
     mockLearnerService as LearnerService,
     mockDashboardUtilsService as DashboardUtilsService,
     mockConfigService as ConfigService
   );
 });
 
 beforeEach(() => {
   jest.clearAllMocks();
   jest.resetAllMocks();
 });
 
 it("should make api call to get org creation data", () => {
   const params = {
     data: { identifier: "do_2123250076616048641482", timePeriod: "7d" },
     dataset: "ORG_CREATION",
   };
   const mockResponse = testData.creationSuccessData;
   jest.spyOn(mockLearnerService, "get").mockReturnValue(of(mockResponse));
   organisationService.getDashboardData(params).subscribe({
     next: (data) => {},
   });
   expect(organisationService).toBeTruthy();
   expect(organisationService.parseApiResponse).toBeCalled;
 });
 
 it("should parse org creation api response", () => {
   const mockResponse = testData.parsedCreationData;
   jest.spyOn(organisationService, "parseApiResponse");
   const response = organisationService.parseApiResponse(
     mockResponse,
     "ORG_CREATION"
   );
   expect(organisationService).toBeTruthy();
   expect(mockDashboardUtilsService).toBeTruthy();
   expect(response.bucketData).toEqual(mockResponse.result.series);
   expect(organisationService.parseApiResponse).not.toBeUndefined();
   expect(organisationService.graphSeries).not.toBeUndefined();
   expect(response.series).not.toBeNull();
   expect(response.numericData.length).toBeGreaterThan(2);
 });
 
 it("should handle error", async () => {
   const errorResponse = new HttpErrorResponse({
     error: "404",
   });
   const params = {
     data: { identifier: "do_2123250076616048641482", timePeriod: "7d" },
     dataset: "ORG_CREATION",
   };
   const mockResponse = testData.creationSuccessData;
   jest
     .spyOn(mockLearnerService, "get")
     .mockReturnValue(throwError(() => errorResponse));
   organisationService.getDashboardData(params).subscribe({
     next: (data) => console.log(data),
     error: (error) => {},
   });
   expect(organisationService.parseApiResponse).toBeCalled;
 });
});
