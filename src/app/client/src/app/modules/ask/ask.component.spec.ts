import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AskComponent } from './ask.component';
import { AskService } from './services/ask.service';
import { ConfigService } from '../shared/services';
import { UserService } from '../core/services';

describe('AskComponent', () => {
  let component: AskComponent;
  let fixture: ComponentFixture<AskComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockResourceService: jest.Mocked<ResourceService>;
  let mockTelemetryService: jest.Mocked<TelemetryService>;
  let mockAskService: jest.Mocked<AskService>;
  let mockConfigService: any;
  let mockUserService: any;

  beforeEach(async () => {
    // Create mock services
    mockRouter = {
      navigate: jest.fn()
    } as any;
    mockResourceService = {
      getResource: jest.fn()
    } as any;
    mockTelemetryService = {
      interact: jest.fn()
    } as any;
    mockAskService = {
      askQuestion: jest.fn(() => of({ message_type: 'result', results: [] }))
    } as any;
    mockConfigService = {
      urlConFig: {
        URLS: {
          CONTENT: {
            SEARCH: '/api/content/v1/search'
          }
        }
      }
    };
    mockUserService = {
      userid: 'testUser',
      loggedIn: true
    };

    await TestBed.configureTestingModule({
      declarations: [ AskComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: TelemetryService, useValue: mockTelemetryService },
        { provide: AskService, useValue: mockAskService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UserService, useValue: mockUserService }
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
    // Clear any previous calls from ngOnInit
    mockTelemetryService.interact.mockClear();
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
    jest.spyOn(component, 'onAsk');
    component.onKeyPress(event);
    expect(component.onAsk).toHaveBeenCalled();
  });
});
