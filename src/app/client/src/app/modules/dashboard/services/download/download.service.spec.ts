import { ConfigService } from "../../../shared/services/config/config.service";
import { DownloadService } from "./download.service";
import { LearnerService } from "../../../../modules/core/services/learner/learner.service";
import { DashboardUtilsService } from "../dashboard-utils/dashboard-utils.service";
import { of } from "rxjs";
import * as mockData from "./download.service.spec.data";
const testData = <any>mockData.mockRes;
 
describe("DownloadService", () => {
 let downloadService: DownloadService;
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
   downloadService = new DownloadService(
     mockLearnerService as LearnerService,
     mockDashboardUtilsService as DashboardUtilsService,
     mockConfigService as ConfigService
   );
 });
 
 beforeEach(() => {
   jest.clearAllMocks();
   jest.resetAllMocks();
 });
 
 it("should be created", () => {
   expect(downloadService).toBeTruthy();
 });
 
 it("should call learner service", () => {
   const reqData = {
     data: { identifier: "do_123", timePeriod: "7d" },
     dataset: "COURSE_CONSUMPTION",
   };
   jest
     .spyOn(mockLearnerService, "get")
     .mockReturnValue(of(testData.downloadSuccess));
   jest.spyOn(downloadService, "getReport");
   // Assertions
   expect(downloadService).toBeTruthy();
   expect(mockDashboardUtilsService).toBeTruthy();
   expect(mockLearnerService).toBeTruthy();
   const response = downloadService.getReport(reqData);
   expect(downloadService.getReport).toHaveBeenCalled();
   expect(mockLearnerService.get).toHaveBeenCalled();
 });
});
