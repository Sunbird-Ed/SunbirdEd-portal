import { ResourceService } from "../../../shared";
import { Response } from "./dial-code-card.component.spec.data";
import { DialCodeCardComponent } from "./dial-code-card.component";
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe("DialCodeCardComponent", () => {
  let component: DialCodeCardComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getAllFwCatName: jest.fn(),
  };
  beforeAll(() => {
    component = new DialCodeCardComponent(
      mockResourceService as ResourceService,
      mockCslFrameworkService as CslFrameworkService,

    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show TEST INPUT for all data", () => {
    component.dialCode = "test";
    component.data = Response.cardData;
    component.singleContentRedirect = "B1 Test";
    jest.spyOn(component, "onAction");
    component.ngOnInit();
    expect(component.onAction).toBeCalled();
  });

  describe("ngOnInit", () => {
    it("should call getAllFwCatName on cslFrameworkService if dialCode is provided", () => {
      const testDialCode = "testDialCode";
      component.dialCode = testDialCode;
      component.ngOnInit();
      expect(mockCslFrameworkService.getAllFwCatName).toHaveBeenCalled();
    });
  });
});
