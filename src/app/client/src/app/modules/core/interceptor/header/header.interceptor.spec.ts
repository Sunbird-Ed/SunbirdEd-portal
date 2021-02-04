import { HeaderInterceptor } from './header.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';

describe('Session Expiry Interceptor', () => {

    let headerInterceptor: HeaderInterceptor;
    let httpMock: HttpTestingController;

    configureTestSuite();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }]
        });
        headerInterceptor = TestBed.get(HeaderInterceptor);
        httpMock = TestBed.get(HttpTestingController);
        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
        spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should intercept any api call', () => {
        let httpClient = TestBed.get(HttpClient);
        httpClient.get('/data').subscribe(
            response => {
                expect(response).toBeTruthy();
                expect(localStorage.getItem('traceId')).toEqual('fake-trace-id');
            }
        );
        const req = httpMock.expectOne('/data');

        req.flush({ response: true }, {
            headers: { 'X-Trace-Enabled': 'fake-trace-id' },
            status: 200,
            statusText: 'OK'
        });
    });
});
