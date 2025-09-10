import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '../shared';
import { UserService } from '../core/services';
import { TelemetryService } from '../telemetry';
import { AskService, AskRequest, AskResult } from './services/ask.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * AskComponent - Handles the Ask functionality for users to search and ask questions
 * This component provides a search interface and displays results using the ensemble tool
 */
@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss']
})
export class AskComponent implements OnInit, OnDestroy {
  
  // Search query input
  searchQuery: string = '';
  
  // Loading state for search
  isSearching: boolean = false;
  
  // Search results
  searchResults: AskResult[] = [];
  
  // Error state
  error: string = '';
  
  // Component lifecycle
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private askService: AskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Initialize component
    this.generateTelemetry('ask-page-view');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles the search/ask action when user clicks the Ask button
   */
  onAsk(): void {
    if (!this.searchQuery.trim()) {
      return; // Don't proceed if query is empty
    }

    console.log('Ask button clicked with query:', this.searchQuery);
    
    this.isSearching = true;
    this.error = '';
    this.searchResults = [];
    
    // Generate telemetry for the ask action
    this.generateTelemetry('ask-search', {
      query: this.searchQuery.trim()
    });

    // Prepare the request
    const request: AskRequest = {
      query: this.searchQuery.trim(),
      site: 'all', // Search all available sites
      model: 'gpt-4o-mini',
      streaming: false,
      generate_mode: 'none',
      oauth_id: this.userService.loggedIn ? this.userService.userid : '',
      thread_id: this.generateThreadId()
    };

    console.log('Making request to Ask service:', request);

    // Call the Ask service
    this.askService.askQuestion(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Ask service response:', response);
          this.isSearching = false;
          this.handleSearchResponse(response);
        },
        error: (error) => {
          console.error('Ask service error:', error);
          this.isSearching = false;
          this.error = error.message || 'Failed to search. Please try again.';
        }
      });
  }

  /**
   * Handles the search response from the Ask service
   */
  private handleSearchResponse(response: any): void {
    if (response.results && Array.isArray(response.results)) {
      this.searchResults = response.results;
      
      // Generate telemetry for successful search
      this.generateTelemetry('ask-search-success', {
        query: this.searchQuery,
        resultCount: this.searchResults.length
      });
    } else {
      this.error = 'No results found. Please try a different question.';
    }
  }

  /**
   * Handles Enter key press in the search input
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onAsk();
    }
  }

  /**
   * Handles retry action when there's an error
   */
  onRetry(): void {
    this.error = '';
    this.onAsk();
  }

  /**
   * Generates a unique thread ID for conversation tracking
   */
  private generateThreadId(): string {
    return `ask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates telemetry events for user interactions
   */
  private generateTelemetry(action: string, data?: any): void {
    const telemetryData = {
      context: {
        env: 'ask',
        cdata: []
      },
      edata: {
        id: action,
        type: 'click',
        pageid: 'ask-page',
        ...data
      }
    };
    
    this.telemetryService.interact(telemetryData);
  }
}
