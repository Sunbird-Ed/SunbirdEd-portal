import { DateValidatorDirective } from "./date-validator.directive";

describe("DateValidatorDirective", () => {
  let directive: DateValidatorDirective;

  beforeEach(() => {
    directive = new DateValidatorDirective();
  });

  it("should create an instance", () => {
    expect(directive).toBeTruthy();
  });

  it("should allow special keys", () => {
    const specialKeys = ["Backspace", "Tab", "End", "Home", "/"];

    specialKeys.forEach((key) => {
      const event = new KeyboardEvent("keydown", { key });
      directive.onKeyDown(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  it("should allow numeric input", () => {
    const numericKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    numericKeys.forEach((key) => {
      const event = new KeyboardEvent("keydown", { key });
      directive.onKeyDown(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  it("should prevent non-numeric input", () => {
    const nonNumericKeys = ["a", "b", "c", "-", "."];

    nonNumericKeys.forEach((key) => {
      const event = new KeyboardEvent("keydown", { key });
      jest.spyOn(event, "preventDefault");
      directive.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
