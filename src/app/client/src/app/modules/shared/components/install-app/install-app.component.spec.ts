import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InstallAppComponent } from './install-app.component';
import { ResourceService } from '../../services/index';

describe('InstallAppComponent', () => {
    let comp: InstallAppComponent;
    let fixture: ComponentFixture<InstallAppComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ InstallAppComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [ResourceService]
        });
        fixture = TestBed.createComponent(InstallAppComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('showPopUp defaults to: true', () => {
        expect(comp.showPopUp).toEqual(true);
    });
    it(' makes expected calls to   navigateToLibrary', () => {
      spyOn(comp, 'closePopUp');
      comp.navigateToLibrary();
      expect(comp.closePopUp).toHaveBeenCalled();
  });
});
