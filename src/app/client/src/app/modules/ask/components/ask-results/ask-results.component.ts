import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AskResult, AskResponse } from '../../services/ask.service';
import { Router } from '@angular/router';

/**
 * AskResultsComponent - Displays search results from the Ask functionality
 * This component renders normalized results from NLWeb tools in a format consistent with Sunbird's design system
 * Supports all 8 NLWeb tools: Search, Details, Ensemble, etc.
 */
@Component({
  selector: 'app-ask-results',
  templateUrl: './ask-results.component.html',
  styleUrls: ['./ask-results.component.scss']
})
export class AskResultsComponent implements OnInit, OnDestroy {
  
  @Input() results: AskResult[] = [];
  @Input() query: string = '';
  @Input() isLoading: boolean = false;
  @Input() error: string = '';
  @Input() response: AskResponse | null = null;
  
  @Output() resultClick = new EventEmitter<AskResult>();
  @Output() retry = new EventEmitter<void>();

  // Filter and sort options
  selectedType: string = 'all';
  sortBy: string = 'score';
  minScore: number = 0;

  // Available content types for filtering
  contentTypes: string[] = ['all', 'video', 'pdf', 'etextbook', 'presentation', 'audio', 'interactive', 'content', 'course'];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Handle click on a result item
   * @param result - The clicked result
   */
  handleResultClick(result: AskResult): void {
    this.trackResultClick(result);
  
    const schemaObject = (result as any).schema_object || {};
    let contentId = schemaObject.identifier || this.extractContentIdFromUrl(result.url);
    console.log('DEBUG printing contentId:', contentId, 'schemaObject:', schemaObject, 'url:', result.url);

    if (!contentId) {
      console.error('No content ID found for result:', result);
      return;
    }
  
    // Navigate properly based on MIME type
    if (schemaObject.mimeType === 'application/vnd.ekstep.content-collection') {
      this.router.navigate(['/learn/course', contentId]);
    } else {
      this.router.navigate(['/resources/play/content', contentId]);
    }
  }
  
  onResultClick(result: AskResult): void {
    this.resultClick.emit(result);
    
    // Check MIME type to determine navigation
    const schemaObject = (result as any).schema_object || {};
    const mimeType = schemaObject.mimeType || '';
    
    if (mimeType === 'application/vnd.ekstep.content-collection') {
      // Navigate to collection player
      this.navigateToCollection(result);
    } else {
      // Navigate to content player
      this.navigateToContent(result);
    }
  }

  /**
   * Navigate to collection player
   * @param result - The result to navigate to
   */
  private navigateToCollection(result: AskResult): void {
    // Extract content ID from URL or schema object
    const schemaObject = (result as any).schema_object || {};
    const contentId = schemaObject.identifier || this.extractContentIdFromUrl(result.url);
    
    if (contentId) {
      this.router.navigate(['/learn/course', contentId]);
    } else {
      console.error('No content ID found for collection:', result);
    }
  }

  /**
   * Navigate to content player
   * @param result - The result to navigate to
   */
  private navigateToContent(result: AskResult): void {
    // Extract content ID from URL or schema object
    const schemaObject = (result as any).schema_object || {};
    const contentId = schemaObject.identifier || this.extractContentIdFromUrl(result.url);
    
    if (contentId) {
      this.router.navigate(['/resources/play/content', contentId]);
    } else {
      console.error('No content ID found for content:', result);
    }
  }

  /**
   * Extract content ID from URL
   * @param url - The URL to extract ID from
   * @returns Content ID or null
   */
  private extractContentIdFromUrl(url: string): string | null {
    if (!url) return null;
    
    // Try to extract ID from various URL patterns
    const patterns = [
      /\/content\/v1\/read\/([^\/\?]+)/,  // /content/v1/read/do_xxx
      /\/play\/content\/([^\/\?]+)/,      // /play/content/do_xxx
      /\/course\/([^\/\?]+)/,             // /course/do_xxx
      /\/resources\/play\/content\/([^\/\?]+)/, // /resources/play/content/do_xxx
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Get filtered and sorted results
   * @returns Filtered and sorted results array
   */
  getFilteredResults(): AskResult[] {
    let filteredResults = [...this.results];

    // Filter by content type
    if (this.selectedType !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.type && result.type.toLowerCase() === this.selectedType.toLowerCase()
      );
    }

    // Filter by minimum score
    if (this.minScore > 0) {
      filteredResults = filteredResults.filter(result => 
        (result.score || 0) >= this.minScore
      );
    }

    // Sort results
    filteredResults.sort((a, b) => {
      switch (this.sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default:
          return 0;
      }
    });

    return filteredResults;
  }

  /**
   * Get unique content types from results
   * @returns Array of unique content types
   */
  getAvailableTypes(): string[] {
    const types = this.results
      .map(result => result.type)
      .filter(type => type && type.trim())
      .map(type => type!.toLowerCase());
    
    return ['all', ...Array.from(new Set(types))];
  }

  /**
   * Get ensemble information if available
   * @returns Ensemble info object or null
   */
  getEnsembleInfo(): any {
    return this.response?.ensemble_info || null;
  }

  /**
   * Check if results contain ensemble recommendations
   * @returns Boolean indicating if ensemble results are present
   */
  hasEnsembleResults(): boolean {
    return this.results.some(result => result.ensemble_theme);
  }

  /**
   * Get the display type for a result
   * @param result - The result item
   * @returns Display type string
   */
  getResultType(result: AskResult): string {
    if (result.type) {
      return result.type.toUpperCase();
    }
    
    // Infer type from URL or content
    if (result.url) {
      if (result.url.includes('youtube.com') || result.url.includes('video')) {
        return 'VIDEO';
      } else if (result.url.includes('.pdf') || result.url.includes('pdf')) {
        return 'PDF';
      } else if (result.url.includes('course') || result.url.includes('learn')) {
        return 'COURSE';
      }
    }
    
    return 'CONTENT';
  }

  /**
   * Get the type color for styling
   * @param type - The result type
   * @returns CSS class for type color
   */
  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      'video': 'video-type',
      'pdf': 'pdf-type',
      'course': 'course-type',
      'content': 'content-type',
      'presentation': 'presentation-type',
      'lesson': 'lesson-type',
      'etextbook': 'etextbook-type',
      'audio': 'audio-type',
      'interactive': 'interactive-type',
      'explanation': 'explanation-type',
      'story': 'story-type',
      'poem': 'poem-type',
      'activity': 'activity-type',
      'simulation': 'simulation-type',
      'game': 'game-type',
      'quiz': 'quiz-type',
      'experiment': 'experiment-type',
      'experiential': 'experiment-type',
      'eaperiential': 'experiment-type', // Handle typo
      'tutorial': 'tutorial-type',
      'guide': 'guide-type',
      'reference': 'reference-type',
      'worksheet': 'worksheet-type',
      'assessment': 'assessment-type',
      'image': 'image-type',
      'webpage': 'webpage-type',
      'document': 'document-type',
      'spreadsheet': 'spreadsheet-type',
      'collection': 'collection-type'
    };
    
    return typeColors[type?.toLowerCase()] || 'content-type';
  }

  /**
   * Check if result has a valid thumbnail
   * @param result - The result item
   * @returns Boolean indicating if thumbnail exists
   */
  hasThumbnail(result: AskResult): boolean {
    return !!(result.thumbnail && result.thumbnail.trim());
  }

  /**
   * Check if result has content metadata
   * @param result - The result item
   * @returns Boolean indicating if content metadata exists
   */
  hasContentMetadata(result: AskResult): boolean {
    return !!(result.medium || 
              (result.subject && result.subject.length > 0) || 
              (result.grade && result.grade.length > 0) ||
              (result.board && result.board.length > 0));
  }

  /**
   * Get the truncated description
   * @param description - The full description
   * @param maxLength - Maximum length (default 150)
   * @returns Truncated description
   */
  getTruncatedDescription(description: string, maxLength: number = 150): string {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  }

  /**
   * Get formatted score for display
   * @param score - The score value
   * @returns Formatted score string
   */
  getFormattedScore(score: number): string {
    if (!score) return '0';
    
    // If score is already in percentage format (0-100), use as is
    if (score >= 0 && score <= 100) {
      return Math.round(score).toString();
    }
    
    // If score is in decimal format (0-1), convert to percentage
    if (score > 0 && score <= 1) {
      return Math.round(score * 100).toString();
    }
    
    // For any other format, cap at 100%
    return Math.min(Math.round(score), 100).toString();
  }

  /**
   * Get CSS class for score styling
   * @param score - The score value
   * @returns CSS class name
   */
  getScoreClass(score: number): string {
    if (!score) return 'score-low';
    
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }

  /**
   * Track result click for analytics
   * @param result - The clicked result
   */
  trackResultClick(result: AskResult): void {
    // TODO: Implement telemetry tracking
    console.log('Result clicked:', result.name, result.url);
  }

  /**
   * Handle retry action
   */
  onRetry(): void {
    this.retry.emit();
  }

  /**
   * Handle filter change
   * @param type - Selected content type
   */
  onTypeFilterChange(type: string): void {
    this.selectedType = type;
  }

  /**
   * Handle sort change
   * @param sortBy - Sort criteria
   */
  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
  }

  /**
   * Handle score filter change
   * @param minScore - Minimum score threshold
   */
  onScoreFilterChange(minScore: number): void {
    this.minScore = minScore;
  }

  /**
   * Get result count by type
   * @param type - Content type
   * @returns Count of results for the type
   */
  getResultCountByType(type: string): number {
    if (type === 'all') {
      return this.results.length;
    }
    return this.results.filter(result => 
      result.type && result.type.toLowerCase() === type.toLowerCase()
    ).length;
  }

  /**
   * Get average score of results
   * @returns Average score
   */
  getAverageScore(): number {
    if (this.results.length === 0) return 0;
    
    const totalScore = this.results.reduce((sum, result) => sum + (result.score || 0), 0);
    return Math.round(totalScore / this.results.length);
  }

  /**
   * Format recommendation text to handle JSON strings and make them readable
   * @param recommendation - Raw recommendation text
   * @returns Formatted recommendation HTML
   */
  formatRecommendation(recommendation: string): string {
    if (!recommendation) return '';
    
    // Check if it's a JSON string
    try {
      const parsed = JSON.parse(recommendation);
      if (typeof parsed === 'object' && parsed !== null) {
        // Handle specific JSON structure from screenshot
        if (parsed.comprehensive_overview && parsed.recommendations) {
          // Show recommendations if available, otherwise show comprehensive overview
          if (parsed.recommendations && parsed.recommendations !== 'None provided in the item description') {
            return `<div class="recommendation-description">${parsed.recommendations}</div>`;
          } else if (parsed.comprehensive_overview) {
            return `<div class="recommendation-description">${parsed.comprehensive_overview}</div>`;
          }
        }
        
        // Handle other JSON structures
        // let formatted = '';
        // if (parsed.name) {
        //   formatted += `<div class="recommendation-name">${parsed.name}</div>`;
        // }
        // if (parsed.description) {
        //   formatted += `<div class="recommendation-description">${parsed.description}</div>`;
        // }
        // if (parsed.creator) {
        //   formatted += `<div class="recommendation-creator">Created by: ${parsed.creator}</div>`;
        // }
        // if (parsed.contentUrl) {
        //   formatted += `<div class="recommendation-url">Resource URL: <a href="${parsed.contentUrl}" target="_blank">View Resource</a></div>`;
        // }
        // return formatted || recommendation;
      }
    } catch (e) {
      // Not JSON, return as is
    }
    
    // Check if it's a structured text (like the screenshot shows)
    if (recommendation.includes('Created by:') && recommendation.includes('URL:')) {
      // Parse structured text format
      const lines = recommendation.split('\n').filter(line => line.trim());
      let formatted = '';
      
      lines.forEach(line => {
        if (line.includes('Created by:')) {
          formatted += `<div class="recommendation-creator">${line}</div>`;
        } else if (line.includes('URL:')) {
          const url = line.replace('URL:', '').trim();
          formatted += `<div class="recommendation-url">Resource URL: <a href="${url}" target="_blank">View Resource</a></div>`;
        } else if (line.trim()) {
          formatted += `<div class="recommendation-description">${line}</div>`;
        }
      });
      
      return formatted || recommendation;
    }
    
    // Return the original text if it's not JSON or structured
    return recommendation;
  }

  /**
   * Get display name for content type
   * @param type - Content type
   * @returns Display name
   */
  getContentTypeDisplayName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'video': 'VIDEO',
      'pdf': 'PDF',
      'etextbook': 'E-TEXTBOOK',
      'presentation': 'PRESENTATION',
      'audio': 'AUDIO',
      'interactive': 'INTERACTIVE',
      'content': 'CONTENT',
      'course': 'COURSE',
      'lesson': 'LESSON PLAN',
      'worksheet': 'WORKSHEET',
      'assessment': 'ASSESSMENT',
      'explanation': 'EXPLANATION',
      'story': 'STORY',
      'poem': 'POEM',
      'activity': 'ACTIVITY',
      'simulation': 'SIMULATION',
      'game': 'GAME',
      'quiz': 'QUIZ',
      'experiment': 'EXPERIMENT',
      'experiential': 'EXPERIMENT',
      'eaperiential': 'EXPERIMENT', // Handle typo
      'tutorial': 'TUTORIAL',
      'guide': 'GUIDE',
      'reference': 'REFERENCE',
      'image': 'IMAGE',
      'webpage': 'WEBPAGE',
      'document': 'DOCUMENT',
      'spreadsheet': 'SPREADSHEET',
      'collection': 'COLLECTION'
    };
    
    return typeMap[type?.toLowerCase()] || 'CONTENT';
  }

  /**
   * Determine content type from result data
   * @param result - The result object
   * @returns Content type string
   */
  determineContentTypeFromResult(result: AskResult): string {
    // Only check MIME type for content type detection
    const schemaObject = (result as any).schema_object || {};
    const mimeType = (schemaObject.mimeType || '').toLowerCase();
    
    if (mimeType) {
      if (mimeType.includes('pdf')) return 'pdf';
      if (mimeType.includes('video')) return 'video';
      if (mimeType.includes('audio')) return 'audio';
      if (mimeType.includes('image')) return 'image';
      if (mimeType.includes('text/html')) return 'webpage';
      if (mimeType.includes('application/msword') || mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml')) {
        return 'document';
      }
      if (mimeType.includes('application/vnd.ms-powerpoint') || mimeType.includes('application/vnd.openxmlformats-officedocument.presentationml')) {
        return 'presentation';
      }
      if (mimeType.includes('application/vnd.ms-excel') || mimeType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml')) {
        return 'spreadsheet';
      }
      if (mimeType.includes('application/vnd.ekstep.content-collection')) {
        return 'collection';
      }
    }
    
    // Default to content if no MIME type found
    return 'content';
  }

  /**
   * Get icon for content type
   * @param type - The content type
   * @returns Icon class name
   */
  getContentTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'pdf': 'icon-file-pdf',
      'video': 'icon-video',
      'audio': 'icon-audio',
      'image': 'icon-image',
      'webpage': 'icon-globe',
      'document': 'icon-file-text',
      'presentation': 'icon-presentation',
      'spreadsheet': 'icon-table',
      'explanation': 'icon-lightbulb',
      'lesson': 'icon-book',
      'worksheet': 'icon-clipboard',
      'assessment': 'icon-check-circle',
      'story': 'icon-book-open',
      'poem': 'icon-feather',
      'activity': 'icon-activity',
      'simulation': 'icon-cpu',
      'game': 'icon-gamepad',
      'quiz': 'icon-help-circle',
      'experiment': 'icon-flask',
      'experiential': 'icon-flask',
      'eaperiential': 'icon-flask', // Handle typo
      'tutorial': 'icon-play-circle',
      'guide': 'icon-map',
      'reference': 'icon-bookmark',
      'content': 'icon-file',
      'collection': 'icon-folder'
    };
    
    return iconMap[type?.toLowerCase()] || 'icon-file';
  }

  /**
   * Handle image loading error
   * @param event - The error event
   */
  onImageError(event: any): void {
    // Hide the image if it fails to load
    event.target.style.display = 'none';
  }
}