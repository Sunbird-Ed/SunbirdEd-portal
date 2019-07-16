import { RouterTestingModule } from '@angular/router/testing';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { MainFooterComponent } from './main-footer.component';
import { CacheService } from 'ng2-cache-service';
import { of } from 'rxjs';
import { TelemetryModule } from '@sunbird/telemetry';
describe('MainFooterComponent', () => {
    let component: MainFooterComponent;
    let fixture: ComponentFixture<MainFooterComponent>;
    const mockActivatedRoute = {
        queryParams: of({
            dialCode: 'EJ23P',
            source: 'paytm'
        }),
        snapshot: {
            firstChild: {
                firstChild: {
                    params: {
                        slug: 'sunbird'
                    }
                }
            }
        },
        firstChild: {
            firstChild: {
                snapshot: {
                    data: {
                        sendUtmParams: false
                    }
                },
                params: of({})
            }
        }
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainFooterComponent],
            providers: [CacheService, ConfigService, { provide: ResourceService, useValue: { instance: 'SUNBIRD' } }, {
                provide: ActivatedRoute, useValue: mockActivatedRoute
            }],
            imports: [HttpClientModule, WebExtensionModule.forRoot(), TelemetryModule.forRoot(), SharedModule, RouterTestingModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should redirect to diksha app with UTM params if dialcode avaiable', () => {
        TestBed.get(ActivatedRoute).firstChild.firstChild.snapshot.data.sendUtmParams = true;
        fixture.detectChanges();
        const spy = spyOn(component, 'redirect');
        component.redirectToDikshaApp();
        expect(spy).toHaveBeenCalledWith('https://play.google.com/store/apps/details?id=in.gov.diksha.app&utm_source=' +
        'diksha-sunbird&utm_medium=paytm&utm_campaign=dial&utm_term=EJ23P');
    });

    it('should redirect to diksha app with UTM params if dialcode is not avaiable', () => {
        TestBed.get(ActivatedRoute).firstChild.firstChild.snapshot.data.sendUtmParams = true;
        TestBed.get(ActivatedRoute).queryParams = of({ dialCode: '' });
        fixture.detectChanges();
        const spy = spyOn(component, 'redirect');
        component.redirectToDikshaApp();
        expect(spy).toHaveBeenCalledWith('https://play.google.com/store/apps/details?id=in.gov.diksha.app&utm_source=' +
        'diksha-sunbird&utm_medium=get&utm_campaign=redirection');
    });

    it('should redirect to diksha app without UTM params if not avaiable', () => {
        TestBed.get(ActivatedRoute).firstChild.firstChild.snapshot.data.sendUtmParams = false;
        fixture.detectChanges();
        const spy = spyOn(component, 'redirect');
        component.redirectToDikshaApp();
        expect(spy).toHaveBeenCalledWith('https://play.google.com/store/apps/details?id=in.gov.diksha.app');
    });
});
