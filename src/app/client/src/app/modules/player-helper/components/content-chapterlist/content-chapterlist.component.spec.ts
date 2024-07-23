import { Component,OnInit,OnDestroy,OnChanges,Input,EventEmitter,Output } from '@angular/core';
import { ContentChapterlistComponent } from './content-chapterlist.component';

describe('ContentChapterlistComponent', () => {
    let component: ContentChapterlistComponent;

    beforeAll(() => {
        component = new ContentChapterlistComponent()
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit tocChapterClick when onTocChapterClick is called with different active content', () => {
        const mockEvent = {};
        const mockContent = {
          sbUniqueIdentifier: '1',
        };
    
        const emitSpy = jest.spyOn(component.tocChapterClick, 'emit');
    
        component.activeContent = { sbUniqueIdentifier: '2' }; // Set a different active content
        component.onTocChapterClick(mockEvent, mockContent);

        expect(emitSpy).toHaveBeenCalledWith({
          event: mockEvent,
          data: { ...mockContent },
        });
    });

    it('should not emit tocChapterClick when onTocChapterClick is called with the same active content', () => {
        const mockEvent = {};
        const mockContent = {
          sbUniqueIdentifier: '1',
        };
    
        const emitSpy = jest.spyOn(component.tocChapterClick, 'emit');
    
        component.activeContent = { sbUniqueIdentifier: '1' }; // Set the same active content
        component.onTocChapterClick(mockEvent, mockContent);
    
        expect(emitSpy).not.toHaveBeenCalled();
    });
});