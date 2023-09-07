import { UsageService } from "./usage.service";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

describe("UsageService", () => {
  let usageService: UsageService;
  const httpClient: Partial<HttpClient> = {
    get: jest.fn(),
  };

  beforeAll(() => {
    usageService = new UsageService(httpClient as HttpClient);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should be created", () => {
    expect(usageService).toBeTruthy();
  });

  describe("getData method ", () => {
    it("should call the api without paramaters", () => {
      jest.spyOn(httpClient, "get").mockReturnValue(of({ test: "ok" }));
      usageService.getData("https://dev.sunbirded.org/explore");
      expect(httpClient.get).toHaveBeenCalled();
      expect(httpClient.get).toHaveBeenCalledTimes(1);
      expect(httpClient.get).toHaveBeenCalledWith(
        "https://dev.sunbirded.org/explore",
        { responseType: "json" }
      );
    });

    it("should call the api with parameters", () => {
      jest.spyOn(httpClient, "get").mockReturnValue(of({ test: "ok" }));
      usageService.getData("https://dev.sunbirded.org/explore", {
        params: {
          'test': 'test'
        }
      } as any);
      expect(httpClient.get).toHaveBeenCalled();
    });

    it("should return data  if response do contain result key", () => {
      jest.spyOn(httpClient, "get").mockReturnValue(of({ result: "123" }));
      const result = usageService.getData("https://dev.sunbirded.org/explore");
      expect(httpClient.get).toHaveBeenCalled();
      result.subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: "OK",
          result: "123",
        });
      });
    });

    it("should return data as it is if response do not contain result key", () => {
      jest.spyOn(httpClient, "get").mockReturnValue(of({ data: "123" }));
      const result = usageService.getData("https://dev.sunbirded.org/explore");
      expect(httpClient.get).toHaveBeenCalled();
      result.subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: "OK",
          result: { data: "123" },
        });
      });
    });
  });
});
