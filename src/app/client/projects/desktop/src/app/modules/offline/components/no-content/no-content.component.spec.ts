import { By } from '@angular/platform-browser';
import { TelemetryModule } from '@sunbird/telemetry';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoContentComponent } from './no-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NoContentComponent', () => {
  let component: NoContentComponent;
  let fixture: ComponentFixture<NoContentComponent>;
  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'library',
          pageid: 'library'
        }
      }
    };
  }
  const resourceBundle = {
    instance: 'TENANT',
    frmelmnts: {
      lbl: {
        desktop: {
          explore: 'Explore More Content',
          find_more: 'Find more textbooks and content on {instance}'
        },
        offline: 'You are offline'
      },
      btn: {
        loadContent: 'Load Content'
      }
    },
    messages: {
      stmsg: {
        m0030: 'No Textbooks Available',
      },
      imsg: {
        m0050: 'Load textbooks to access them offline',
        // tslint:disable-next-line:max-line-length
        m0048: 'Please connect to the internet to view content',
        m0049: 'Have a textbook downloaded on your system/ pendrive? Click below link to upload'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ NoContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceBundle }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component.connectionService, 'monitor').and.returnValue(of(true));
    component.ngOnInit();
    expect(component.isConnected).toBeTruthy();
  });

  it('should call handleImportContentDialog', () => {
    spyOn(component, 'addInteractEvent');
    component.handleImportContentDialog('no-content');
    expect(component.showLoadContentModal).toBeTruthy();
    expect(component.addInteractEvent).toHaveBeenCalledWith('no-content');
  });

  it('should call closeLoadContentModal', () => {
    component.showLoadContentModal = true;
    component.closeLoadContentModal();
    expect(component.showLoadContentModal).toBeFalsy();
  });

  it('should change ShowModal', () => {
    expect(component.showModal).toBeFalsy();
    spyOn(component, 'addInteractEvent');
    component.handleModal('no-content-import');
    expect(component.showModal).toBeTruthy();
    expect(component.addInteractEvent).toHaveBeenCalledWith('no-content-import');
  });

  it('should call TelemetryInteract service', () => {
    spyOn(component.telemetryService, 'interact');
    component.addInteractEvent('no-content-import');
    expect(component.telemetryService.interact).toHaveBeenCalled();
  });

  it('should call TelemetryInteract service', () => {
    spyOn(component.telemetryService, 'interact');
    component.addInteractEvent('no-content-import');
    expect(component.telemetryService.interact).toHaveBeenCalled();
  });

  it('should call addInteractEvent from explore content', () => {
    spyOn(component, 'addInteractEvent');
    const filters = {board: 'English', gradeLevel: 'Class 6', medium: 'English'};
    component.filters = filters;
    component.exploreContent('no-content-import');
    expect(component.addInteractEvent).toHaveBeenCalledWith('no-content-import');
    expect(component.router.navigate).toHaveBeenCalledWith(['/search'], {queryParams: filters});
  });

  it('should call explore content', () => {
    component.isConnected = true;
    spyOn(component, 'isBrowsePage').and.callFake(() => of(true));
    spyOn(component, 'exploreContent');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#browse')).nativeElement;
    button.click();
    expect(button.innerText).toContain(resourceBundle.frmelmnts.lbl.desktop.explore);
    expect(component.exploreContent).toHaveBeenCalledWith('explore-more-content');
  });

});
