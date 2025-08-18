import { Injectable } from '@angular/core';
import ls from 'localstorage-ttl';

@Injectable()
export class CacheService {

    constructor() { }

    public get(key?: string) {
        try {
            let value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return false;
        }
    }

    public set(key: string, value: any, options?: any) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    public remove(key: string) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    public removeAll() {
        return localStorage.clear();
    }

    public exists(key?: string) {
        return !!this.get(key);
    }

    public setWithExpiry(key: string, value: any, ttlInSec: number = 10 * 60) {
        try {
            ls.set(key, value, ttlInSec * 1000);
            return true;
        } catch (e) {
            return false;
        }
    }

    public getWithExpiry(key: string) {
        try {
            const value = ls.get(key);
            return value ? value : null;
        } catch (e) {
            return null;
        }
    }

}