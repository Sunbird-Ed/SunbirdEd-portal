import { RendererService } from "./renderer.service";
import { of } from "rxjs";
import { LineChartService } from "../chartjs";
 
describe("RendererService", () => {
 let rendererService: RendererService;
 const lineChartService: Partial<LineChartService> = {
   parseLineChart: jest.fn(),
 };
 
 beforeAll(() => {
   rendererService = new RendererService(lineChartService as LineChartService);
 });
 
 beforeEach(() => {
   jest.clearAllMocks();
   jest.resetAllMocks();
 });
 
 it("should be created", () => {
   expect(rendererService).toBeTruthy();
 });
 
 it("testing visualizer method", () => {
   const test = {
     bucketData: "test",
     numericData: ["a", "b", "c"],
     series: "testdata",
   };
 
   jest.spyOn(rendererService, "visualizer");
   rendererService.visualizer(test, "line");
   expect(lineChartService.parseLineChart).toBeCalled();
 });
});
