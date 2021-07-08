import { TestBed, async, inject } from "@angular/core/testing";

import {
  CanDeactivateGuard,
  ComponentDeactivate,
} from "./can-deactivate.guard";
import { ResourceService } from "@sunbird/shared";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";

class MockComponent implements ComponentDeactivate {
  unloadNotification($event:any) {
    if (!this.canDeactivate) {
      $event.returnValue = true;
    }
  }
  // Set this to the value you want to mock being returned from GuardedComponent
  returnValue: boolean;

  canDeactivate(): boolean {
    return this.returnValue;
  }
}

describe("CanDeactivateGuard", () => {
  let service;
  let mockComponent: MockComponent;
  let resourceBundle = {
    frmelmnts: {
      alert: {
        confirmBackClick: "Confirm",
      },
    },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        CanDeactivateGuard,
        MockComponent,
        { provide: ResourceService, useValue: resourceBundle },
      ],
    });
    service = TestBed.get(CanDeactivateGuard);
    mockComponent = TestBed.get(MockComponent);
  });

  it("expect service to instantiate", () => {
    expect(service).toBeTruthy();
    mockComponent.returnValue = false;
    expect(service.canDeactivate(mockComponent)).toBeFalsy();
  });

  it("expect service to canDeactivate", () => {
    mockComponent.returnValue = true;
    expect(service.canDeactivate(mockComponent)).toBeTruthy();
  });

  it("expect to call ComponentDeactivate", () => {
    spyOn(mockComponent, "canDeactivate").and.callFake(() => {
      return false;
    });
    spyOn(mockComponent, "unloadNotification").and.callThrough();
    let event={returnValue:false}
    mockComponent.unloadNotification(event);
    expect(mockComponent.unloadNotification).toHaveBeenCalled();
  });
});
