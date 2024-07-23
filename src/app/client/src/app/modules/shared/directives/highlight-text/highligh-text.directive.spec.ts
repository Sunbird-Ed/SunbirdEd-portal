import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ResourceService } from '../../services';
import { of, throwError } from "rxjs";
import * as _ from 'lodash-es';
import { IHighlightText } from '../../interfaces';
import { HighlightTextDirective } from './highlight-text.directive';

describe('HighlightTextDirective', () => {
  let directive: HighlightTextDirective;
  const elRef: Partial<ElementRef> ={
    nativeElement: document.createElement('div')
  };
  const mockResourceService: Partial<ResourceService> = {
    get: jest.fn().mockReturnValue(true),
    languageSelected$: of({})
  };

  beforeEach(() => {
    directive = new HighlightTextDirective(
      elRef as ElementRef,
      mockResourceService as ResourceService
    );

  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should highlight text', () => {
    const label = 'Some label with a key';
    directive['elRef'] = { nativeElement: { innerHTML: '' } };
    directive.highlightText(label, 'key', '<span>value</span>');
    expect(directive['elRef'].nativeElement.innerHTML).toContain('<span>value</span>');
  });

  it('should unsubscribe on destroy', () => {
    directive.resourceDataSubscription = { unsubscribe: jest.fn() } as any;
    directive.ngOnDestroy();
    expect(directive.resourceDataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not call highlightText if resourcePath does not exist on ngOnInit', () => {
    directive.config = { resourcePath: 'invalid/path', key: 'key', value: 'value' };
    const highlightTextSpy = jest.spyOn(directive, 'highlightText');
    directive.ngOnInit();
    expect(highlightTextSpy).not.toHaveBeenCalled();
  });

  it('should not call highlightText if resourcePath does not exist in detectLanguageChange', () => {
    directive.config = { resourcePath: 'invalid/path', key: 'key', value: 'value' };
    const highlightTextSpy = jest.spyOn(directive, 'highlightText');
    const languageSelected$Spy = jest.spyOn(mockResourceService.languageSelected$, 'subscribe');

    directive.detectLanguageChange();
    expect(languageSelected$Spy).toHaveBeenCalled();
    expect(highlightTextSpy).not.toHaveBeenCalled();
  });

});
