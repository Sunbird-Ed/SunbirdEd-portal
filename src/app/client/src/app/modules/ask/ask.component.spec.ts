import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { of } from 'rxjs';

import { AskComponent } from './ask.component';

describe('AskComponent', () => {
  let component: AskComponent;
  let fixture: ComponentFixture<AskComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockResourceService: jasmine.SpyObj<ResourceService>;
  let mockTelemetryService: jasmine.SpyObj<TelemetryService>;

  beforeEach(async () => {
    // Create mock services
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockResourceService = jasmine.createSpyObj('ResourceService', ['getResource']);
    mockTelemetryService = jasmine.createSpyObj('TelemetryService', ['interact']);

    await TestBed.configureTestingModule({
      declarations: [ AskComponent ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: TelemetryService, useValue: mockTelemetryService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search query', () => {
    expect(component.searchQuery).toBe('');
  });

  it('should not search when query is empty', () => {
    component.searchQuery = '';
    component.onAsk();
    expect(mockTelemetryService.interact).not.toHaveBeenCalled();
  });

  it('should search when query is provided', () => {
    component.searchQuery = 'test query';
    component.onAsk();
    expect(mockTelemetryService.interact).toHaveBeenCalled();
  });

  it('should handle Enter key press', () => {
    component.searchQuery = 'test query';
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    spyOn(component, 'onAsk');
    component.onKeyPress(event);
    expect(component.onAsk).toHaveBeenCalled();
  });
});
