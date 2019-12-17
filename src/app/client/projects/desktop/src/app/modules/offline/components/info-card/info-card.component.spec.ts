import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardComponent } from './info-card.component';
import { ConnectionService } from '../../services';
import { TelemetryModule } from 'src/app/modules/telemetry';

describe('InfoCardComponent', () => {
  let component: InfoCardComponent;
  let fixture: ComponentFixture<InfoCardComponent>;
  const routerStub = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  class FakeActivatedRoute {
    snapshot = {
      data: {
        telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate' }
      }
    };
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ InfoCardComponent ],
      providers: [
        { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    component.ngOnInit();
    expect(connectionService.monitor).toHaveBeenCalled();
    expect(component.isConnected).toBeTruthy();
  });

  it('should emit event', () => {
    spyOn(component.navigate, 'emit');
    spyOn(component.telemetryService, 'interact');
    component.text = {msg: 'All Downloads will be added to ', linkName: 'My Downloads'};
    component.handleRoute();
    expect(component.navigate.emit).toHaveBeenCalled();
    expect(component.telemetryService.interact).toHaveBeenCalled();
  });

  it('should test for text ', () => {
    component.text = {msg: 'All Downloads will be added to ', linkName: 'My Downloads'};
    (component.router.url as string) = 'browse';
    component.isConnected = true;
    component.ngOnInit();
    const element = fixture.debugElement.query(By.css('.info-container__label.font-weight-bold'));
    console.log('element', element);

  });

});
