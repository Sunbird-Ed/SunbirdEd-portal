
import { _ } from 'lodash-es';
import { Injectable } from '@angular/core';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
    let paginationService: PaginationService;
    
    beforeAll(() => {
        paginationService = new PaginationService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of paginationService', () => {
        expect(paginationService).toBeTruthy();
    });

    describe('getPager', () => {
        it('should return pager object with default values when no arguments are provided', () => {
          const pager = paginationService.getPager(0);
          expect(pager).toEqual({
            totalItems: 0,
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            startPage: 1,
            endPage: 0,
            startIndex: 0,
            endIndex: -1,
            pages: [],
           });
        });
        
        it('should handle edge case when totalPages exceed 99', () => {
            const pager = paginationService.getPager(10000, 3, 10, 5);
            expect(pager.totalPages).toEqual(99);
        });

        it('should handle edge case when totalPages is less than or equal to pageStrip', () => {
            const pager = paginationService.getPager(100, 1, 10, 5);
            expect(pager.startPage).toEqual(1);
            expect(pager.endPage).toEqual(5);
        });
        
        it('should handle when (currentPage + (pageStrip - 1) >= totalPages)', () => {
            const pager = paginationService.getPager(100, 99, 10, 5);
            expect(pager.startPage).toEqual(6);
            expect(pager.endPage).toEqual(10);
        });
        
        it('should handle edge case when currentPage < 1', () => {
            const pager = paginationService.getPager(100, -2, 10, 5);
            expect(pager.startPage).toEqual(1);
            expect(pager.endPage).toEqual(5);
        });

        it('should handle default case', () => {
            const pager = paginationService.getPager(100, 10, 10, 5);
            expect(pager.startPage).toEqual(6);
            expect(pager.endPage).toEqual(10);
        });

        it('should calculate startIndex correctly', () => {
            const totalItems = 100;
            const pageSize = 10;
            const currentPage = 3;
            const pager = paginationService.getPager(totalItems, currentPage, pageSize);
            expect(pager.startIndex).toEqual((currentPage - 1) * pageSize);
        });

        it('should calculate endIndex correctly', () => {
            const totalItems = 100;
            const pageSize = 10;
            const currentPage = 3;
            const pager = paginationService.getPager(totalItems, currentPage, pageSize);
            expect(pager.endIndex).toEqual(Math.min(pager.startIndex + pageSize - 1, totalItems - 1));
        });
      
        it('should create an array of pages within the specified range', () => {
            const totalItems = 100;
            const pageSize = 10;
            const currentPage = 3;
            const pageStrip = 5;
            const pager = paginationService.getPager(totalItems, currentPage, pageSize, pageStrip);
            const expectedPages = [3, 4, 5, 6, 7];
            expect(pager.pages).toEqual(expectedPages);
        });

    });
});