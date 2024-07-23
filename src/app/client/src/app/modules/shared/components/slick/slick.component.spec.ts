import { ComponentFixture, TestBed } from '@angular/core/testing';
import { timer } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SlickComponent } from './slick.component';

describe('SlickComponent', () => {
  let slickComponent: SlickComponent;

  const mockScrollObserver = {
    unsubscribe: jest.fn()
  };

  const mockNativeElement = {
    scrollTo: jest.fn(),
    clientWidth: 0,
    scrollLeft: 0
  };

  const mockHorizontalScrollElem = {
    nativeElement: mockNativeElement
  };

  beforeAll(() => {
    slickComponent = new SlickComponent();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

   afterEach(() => {
    jest.clearAllTimers();
  });

  it('should create', () => {
    expect(slickComponent).toBeTruthy();
  });

  it('should disable "Prev" button when scrollLeft is 0', () => {
    const elem = document.createElement('div');
    jest.spyOn(elem, 'scrollLeft', 'get').mockReturnValue(0);
    slickComponent['updateNavigationBtnStatus'](elem);
    expect(slickComponent.enablePrev).toBeFalsy();
  });

  it('should calculate dotViewCount correctly', () => {
    const elem = document.createElement('div');
    jest.spyOn(elem, 'scrollWidth', 'get').mockReturnValue(1000);
    jest.spyOn(elem, 'clientWidth', 'get').mockReturnValue(500);
    slickComponent['updateNavigationBtnStatus'](elem);
    expect(slickComponent.dotViewCount).toBe(2);
  });

  it('should update selectedDot and call scrollTo with correct parameters', () => {
    const mockHorizontalScrollElem = {
      nativeElement: {
        clientWidth: 100,
        scrollTo: jest.fn(),
      }
    };
    slickComponent.horizontalScrollElem = mockHorizontalScrollElem as ElementRef;
    slickComponent.computeDotSlide(2);
    expect(slickComponent.selectedDot).toBe(2);
    expect(mockHorizontalScrollElem.nativeElement.scrollTo).toHaveBeenCalledWith({
      left: 2 * 100,
    });
  });

  it('should set overflowX to hidden on mouseover', () => {
    const scrollerMock = document.createElement('div');
    scrollerMock.id = 'ngxScroller';
    document.body.appendChild(scrollerMock);
    slickComponent.ngOnInit();
    scrollerMock.dispatchEvent(new Event('mouseover'));
    expect(scrollerMock.style.overflowX).toBe('hidden');
  });

  it('should call updateNavigationBtnStatus after 100ms if horizontalScrollElem exists', () => {
    const horizontalScrollElemMock = { nativeElement: document.createElement('div') };
    slickComponent.horizontalScrollElem = horizontalScrollElemMock as ElementRef;
    const updateNavigationBtnStatusSpy = jest.spyOn(slickComponent as any, 'updateNavigationBtnStatus');
    slickComponent.ngOnChanges();
    jest.advanceTimersByTime(100);
    expect(updateNavigationBtnStatusSpy).toHaveBeenCalled();
  });

  describe('unsubsribe', () => {
    it('should unsubscribe from scrollObserver if it exists', () => {
        const unsubscribeSpy = jest.spyOn(mockScrollObserver, 'unsubscribe');
        slickComponent['scrollObserver'] = mockScrollObserver as any;
        slickComponent.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if scrollObserver is undefined', () => {
      slickComponent['scrollObserver'] = undefined;
      expect(() => slickComponent.ngOnDestroy()).not.toThrow();
    });
  });

  describe('showPrev', () => {
    it('should scroll to the left by clientWidth when horizontalScrollElem exists', () => {
      const clientWidth = 100;
      const scrollLeft = 50;
      const scrollToSpy = jest.spyOn(mockNativeElement, 'scrollTo');
      mockNativeElement.clientWidth = clientWidth;
      mockNativeElement.scrollLeft = scrollLeft;
      slickComponent.horizontalScrollElem = mockHorizontalScrollElem;
      slickComponent.showPrev();
      expect(scrollToSpy).toHaveBeenCalledWith({ left: scrollLeft - clientWidth });
    });

    it('should not throw error if horizontalScrollElem is undefined', () => {
      slickComponent.horizontalScrollElem = undefined;
      expect(() => slickComponent.showPrev()).not.toThrow();
    });
  });


  it('should scroll to the right when horizontalScrollElem exists', () => {
    const slickComponent = new SlickComponent();
    const mockElement = { clientWidth: 100, scrollLeft: 0, scrollTo: jest.fn() };
    slickComponent.horizontalScrollElem = { nativeElement: mockElement };
    slickComponent.showNext();
    expect(mockElement.scrollTo).toHaveBeenCalledWith({ left: 100 });
  });

});
