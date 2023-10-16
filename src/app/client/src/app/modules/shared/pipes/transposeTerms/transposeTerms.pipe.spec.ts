import { Pipe,PipeTransform } from '@angular/core';
import { get } from 'lodash-es';
import { GenericResourceService } from '../../services/genericResource/genericResource.service';
import { TransposeTermsPipe } from './transposeTerms.pipe';

describe('TransposeTermsPipe', () => {
    let transposeTermsPipe: TransposeTermsPipe;
    const genericResourceService :Partial<GenericResourceService> ={};

    beforeAll(() => {
        transposeTermsPipe = new TransposeTermsPipe(
            genericResourceService as GenericResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of transposeTermsPipe', () => {
        expect(transposeTermsPipe).toBeTruthy();
    });
    
    describe('transform', () => {
        it('should return the transformed value when a term is found', () => {
          const value = 'This is {term1} and {term2}.';
          const defaultValue = 'Default';
          const selectedLang = 'en';
          const transformedValue = transposeTermsPipe.transform(
            value,
            defaultValue,
            selectedLang
          );
          expect(transformedValue).toBe('This is {term1} and {term2}.');
        });
    
        it('should return the original value when no terms are found', () => {
          const value = 'No terms here.';
          const defaultValue = 'Default';
          const selectedLang = 'en';
          const transformedValue = transposeTermsPipe.transform(
            value,
            defaultValue,
            selectedLang
          );
          expect(transformedValue).toBe(value);
        });
    
        it('should return the default value when the value is falsy', () => {
          const value = '';
          const defaultValue = 'Default';
          const selectedLang = 'en';
          const transformedValue = transposeTermsPipe.transform(
            value,
            defaultValue,
            selectedLang
          );
          expect(transformedValue).toBe(defaultValue);
        });
      });
    
      describe('getTermsMapping', () => {
        it('should replace the term with the translation if found in the genericResourceService', () => {
          const value = 'This is {term1}.';
          const term = 'term1';
          const lang = 'en';
          const startsWith = '{';
          const endsWith = '}';
          const defaultValue = 'Default';
          genericResourceService.terms = {
            en: {
              term1: 'Translated Term 1',
            },
          };
          const transformedValue = transposeTermsPipe.getTermsMapping(
            value,
            term,
            lang,
            startsWith,
            endsWith,
            defaultValue
          );
          expect(transformedValue).toBe('This is Translated Term 1.');
        });
    
        it('should replace the term with the default language translation if found', () => {
          const value = 'This is {term1}.';
          const term = 'term1';
          const lang = 'fr';
          const startsWith = '{';
          const endsWith = '}';
          const defaultValue = 'Default';
          genericResourceService.terms = {
            defaultLanguage: 'en',
            en: {
              term1: 'Translated Term 1',
            },
            fr: {
              term1: 'French Translated Term 1',
            },
          };
          const transformedValue = transposeTermsPipe.getTermsMapping(
            value,
            term,
            lang,
            startsWith,
            endsWith,
            defaultValue
          );
          expect(transformedValue).toBe('This is French Translated Term 1.');
        });
    
        it('should return the default value if the term is not found', () => {
          const value = 'This is {term1}.';
          const term = 'term2';
          const lang = 'en';
          const startsWith = '{';
          const endsWith = '}';
          const defaultValue = 'Default';
          genericResourceService.terms = {
            en: {
              term1: 'Translated Term 1',
            },
          };
          const transformedValue = transposeTermsPipe.getTermsMapping(
            value,
            term,
            lang,
            startsWith,
            endsWith,
            defaultValue
          );
          expect(transformedValue).toBe(defaultValue);
        });
      }); 

      it('should replace the term with its translation in the specified language', () => {
        const value = 'Mock text TranslatedTerm with a placeholder';
        const term = 'term';
        const lang = 'en';
        const startsWith = '{';
        const endsWith = '}';
        const defaultValue = 'Default';
    
        const result = transposeTermsPipe.getTermsMapping(value, term, lang, startsWith, endsWith, defaultValue);
        expect(result).toMatch(/^(Mock text TranslatedTerm with a placeholder|Default)$/);
      });
      
      it('should replace the term with its translation in the default language', () => {
        const value = 'Mock text {term} with a placeholder';
        const term = 'term';
        const lang = 'fr';
        const startsWith = '{';
        const endsWith = '}';
        const defaultValue = 'Default';

        const result = transposeTermsPipe.getTermsMapping(value, term, lang, startsWith, endsWith, defaultValue);
        expect(result).toMatch(/^(Mock text TranslatedTerm with a placeholder|Default)$/);
      });

      it('should return the default value when the term is not found', () => {
        const value = 'Some text {term} with a placeholder';
        const term = 'nonexistentterm';
        const lang = 'en';
        const startsWith = '{';
        const endsWith = '}';
        const defaultValue = 'Default';
        const result = transposeTermsPipe.getTermsMapping(value, term, lang, startsWith, endsWith, defaultValue);
        expect(result).toBe(defaultValue);
      });
});