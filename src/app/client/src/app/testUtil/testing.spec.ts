import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';

/**
 * Reconfigures current test suit to prevent angular components compilation after every test run.
 * Forces angular test bed to re-create zone and all injectable services by directly
 * changing _instantiated to false after every test run.
 * Cleanups all the changes and reverts test bed configuration after suite is finished.
 */
export const configureTestSuite = (configureAction?: () => void) => {
    const testBedApi: any = getTestBed();
    const originReset = TestBed.resetTestingModule;
    var originalTimeout;

    beforeAll(() => {
      TestBed.resetTestingModule();
      TestBed.resetTestingModule = () => TestBed;
    });


    if (configureAction) {
        beforeAll((done: DoneFn) => (async () => {
            configureAction();
            await TestBed.compileComponents();
        })().then(done).catch(done.fail));
    }

    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    })

    afterEach(() => {
        testBedApi._activeFixtures.forEach((fixture: ComponentFixture<any>) => fixture.destroy());
        testBedApi._instantiated = false;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    afterAll(() => {
        TestBed.resetTestingModule = originReset;
        TestBed.resetTestingModule();
    });
  };
