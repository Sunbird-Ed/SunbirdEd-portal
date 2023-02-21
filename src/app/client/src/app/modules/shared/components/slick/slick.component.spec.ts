import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlickComponent } from './slick.component';

describe('SlickComponent', () => {
  let slickComponent: SlickComponent;

  beforeAll(() => {
    slickComponent = new SlickComponent();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(slickComponent).toBeTruthy();
  });
});
