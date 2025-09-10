import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AskResult } from '../../services/ask.service';

/**
 * AskResultsComponent - Displays search results from the Ask functionality
 * This component renders results in a format consistent with Sunbird's design system
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

  constructor() { }

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
  onResultClick(result: AskResult): void {
    if (result.url) {
      // Open in new tab for external links
      window.open(result.url, '_blank');
    }
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
      'VIDEO': 'video-type',
      'PDF': 'pdf-type',
      'COURSE': 'course-type',
      'CONTENT': 'content-type',
      'PRESENTATION': 'presentation-type'
    };
    
    return typeColors[type] || 'content-type';
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
    // Emit retry event to parent component
    // This will be handled by the parent AskComponent
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
