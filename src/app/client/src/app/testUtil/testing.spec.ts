import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';

/**
 * Reconfigures current test suit to prevent angular components compilation after every test run.
 * Forces angular test bed to re-create zone and all injectable services by directly
 * changing _instantiated to false after every test run.
 * Cleanups all the changes and reverts test bed configuration after suite is finished.
 */
export const configureTestSuite = () => {
    const testBedApi: any = getTestBed();
    const originReset = TestBed.resetTestingModule;

    beforeAll(() => {
      TestBed.resetTestingModule();
      TestBed.resetTestingModule = () => TestBed;
    });

    afterEach(() => {
        testBedApi._activeFixtures.forEach((fixture: ComponentFixture<any>) => fixture.destroy());
        testBedApi._instantiated = false;
    });

    afterAll(() => {
        TestBed.resetTestingModule = originReset;
        TestBed.resetTestingModule();
    });
  };
