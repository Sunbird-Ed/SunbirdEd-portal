import { ResourceService } from "../../../shared";
import { Response } from "./dial-code-card.component.spec.data";
import { DialCodeCardComponent } from "./dial-code-card.component";

describe("DialCodeCardComponent", () => {
  let component: DialCodeCardComponent;
  const mockResourceService: Partial<ResourceService> = {};

  beforeAll(() => {
    component = new DialCodeCardComponent(
      mockResourceService as ResourceService
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
});
