import { CacheService } from './cache.service';
import { Injectable } from '@angular/core';

describe('CacheService', () => {
    let cacheService: CacheService;

    beforeAll(() => {
        cacheService = new CacheService();
    });

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(cacheService).toBeTruthy();
    });

    it('should set and get a value in local storage', () => {
        const key = 'mockKey';
        const value = { name: 'mockName' };
        cacheService.set(key, value);
        const retrievedValue = cacheService.get(key);
        expect(retrievedValue).toEqual(value);
    });

    it('should return null if the key does not exist in local storage', () => {
        const key = 'nonExistentMockKey';
        const retrievedValue = cacheService.get(key);
        expect(retrievedValue).toBeNull();
    });
    
    it('should remove a value from local storage', () => {
        const key = 'mockKey';
        const value = { name: 'mockname' };
        cacheService.set(key, value);
        cacheService.remove(key);
        const retrievedValue = cacheService.get(key);
        expect(retrievedValue).toBeNull();
    });

    it('should clear all values from local storage', () => {
        const key1 = 'mockkey1';
        const key2 = 'mockkey2';
        cacheService.set(key1, 'mockvalue1');
        cacheService.set(key2, 'mockvalue2');
        cacheService.removeAll();
        const retrievedValue1 = cacheService.get(key1);
        const retrievedValue2 = cacheService.get(key2);
        expect(retrievedValue1).toBeNull();
        expect(retrievedValue2).toBeNull();
    });
    
    it('should check if a key exists in local storage', () => {
        const key = 'existingMockKey';
        cacheService.set(key, 'mockvalue');
        expect(cacheService.exists(key)).toBeTruthy();
        const nonExistentKey = 'nonExistenMocktKey';
        expect(cacheService.exists(nonExistentKey)).toBeFalsy();
    }); 
    
    it('should return false when an error occurs in the get method', () => {
        const key = 'mockKey';
        localStorage.setItem(key, 'invalid-mock-json'); 
        const result = cacheService.get(key);
        expect(result).toBe(false);
    });
    
    it('should return false when an error occurs in the set method', () => {
        const key = 'mockKey';
        const invalidValue = { toJSON: () => { throw new Error('Simulated Error'); } };
        const result = cacheService.set(key, invalidValue);
        expect(result).toBe(false);
    });  
});