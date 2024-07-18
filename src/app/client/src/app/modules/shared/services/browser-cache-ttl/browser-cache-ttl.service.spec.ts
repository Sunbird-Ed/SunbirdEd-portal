
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Injectable } from '@angular/core';
import { BrowserCacheTtlService } from './browser-cache-ttl.service';
describe('BrowserCacheTtlService', () => {
    let component: BrowserCacheTtlService;

    beforeAll(() => {
        component = new BrowserCacheTtlService(
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    beforeEach(() => {
        document.body.innerHTML = `
          <input type='hidden' id='apiCacheTtl' vlaue='500'>
        `;
      });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and apiCacheTtl value ', () => {
        component['_browserCacheTtl'] = '800';
        const value= component['browserCacheTtl'];
        expect(value).toEqual(800);
    });
});