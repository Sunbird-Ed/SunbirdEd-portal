import { configureTestSuite } from '@sunbird/test-util';
import { MarkdownDirective } from './markdown.directive';
import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';



describe('MarkdownDirective', () => {
    let markdownDirective: MarkdownDirective;
    configureTestSuite();
    beforeEach(() => {
        const elementRefStub = { nativeElement: { 'innerHTML': '' } };
        TestBed.configureTestingModule({
            providers: [
                MarkdownDirective,
                { provide: ElementRef, useValue: elementRefStub }
            ]
        });
        markdownDirective = TestBed.get(MarkdownDirective);
    });

    it('can load instance', () => {
        expect(markdownDirective).toBeTruthy();
    });


});
