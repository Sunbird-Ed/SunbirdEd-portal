import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {

    public get(key?: string) {
        let value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    public set(key: string, value: any, options?:  any) {
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

}