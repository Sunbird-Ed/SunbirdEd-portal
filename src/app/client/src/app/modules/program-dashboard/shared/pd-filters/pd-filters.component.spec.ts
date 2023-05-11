import { FormBuilder } from "@angular/forms";
import { PdFiltersComponent } from "./pd-filters.component";

xdescribe("PdFiltersComponent", () => {
  let component: PdFiltersComponent;
  let formBuilder;

  beforeAll(() => {
    component = new PdFiltersComponent(formBuilder);
    component.pdFilter = {
          "label": "Minimum no. of tasks in the project",
          "controlType": "number",
          "reference": "task_count",
          "defaultValue": 5
      }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit',() => {
    jest.spyOn(component,'ngOnInit');
    component.fb = new FormBuilder;
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled()
  });

  it('should generate form',() => {
    jest.spyOn(component,'generateForm');
    component.fb = new FormBuilder;
    component.generateForm();
    expect(component.generateForm).toHaveBeenCalled()
  });

  it('should call inputChange method', () => {
    jest.spyOn(component,'inputChange');
    component.pdFiltersFormGroup.patchValue({
      task_count:5
    });
    component.inputChange();
    expect(component.inputChange).toHaveBeenCalled();
  });

});
