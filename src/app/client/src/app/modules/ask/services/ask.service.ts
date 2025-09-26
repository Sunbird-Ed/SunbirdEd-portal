import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from '../../shared';

/**
 * Interface for Ask API request
 */
export interface AskRequest {
  query: string;
  site?: string;
  model?: string;
  streaming?: boolean;
  generate_mode?: string;
  oauth_id?: string;
  thread_id?: string;
}

/**
 * Interface for Ask API response
 */
export interface AskResponse {
  message_type: string;
  results?: AskResult[];
  query_id?: string;
  error?: string;
  tool_selection?: any;
  remember?: any;
  ensemble_info?: any;
  [key: string]: any;
}

/**
 * Interface for individual search results - Normalized structure
 */
export interface AskResult {
  // Core identification
  id?: string;
  name: string;
  url: string;
  
  // Content information
  description?: string;
  snippet?: string;
  type?: string;
  category?: string;
  
  // Scoring and relevance
  score?: number;
  relevance?: number;
  
  // Media and presentation
  thumbnail?: string;
  image?: string;
  
  // Educational metadata
  medium?: string;
  subject?: string[];
  grade?: string[];
  board?: string[];
  
  // Recommendations and explanations
  recommendation?: string;
  why_recommended?: string;
  
  // Technical metadata
  schema_object?: any;
  details?: any;
  site?: string;
  
  // Ensemble-specific fields
  ensemble_theme?: string;
  ensemble_tips?: string[];
  ensemble_type?: string;
  total_items_retrieved?: number;
}

/**
 * Interface for NLWeb tool responses
 */
export interface NLWebToolResponse {
  message_type: string;
  name?: string;
  url?: string;
  explanation?: string;
  score?: number;
  schema_object?: any;
  details?: any;
  site?: string;
  result?: any;
  [key: string]: any;
}

/**
 * AskService - Handles integration with NLWeb ask API
 * This service provides methods to query NLWeb and normalize responses from different tools
 * Supports 8 different NLWeb tools: Search, Details, Ensemble, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class AskService {
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // All requests now go through the backend proxy at /nlweb/ask/*
  }

  /**
   * Ask a question using NLWeb ask API
   * @param request - The ask request parameters
   * @returns Observable of AskResponse
   */
  askQuestion(request: AskRequest): Observable<AskResponse> {
    console.log('AskService: Making request to /nlweb/ask/proxy with:', request);
    
    // Use the proxy service instead of direct calls
    return this.http.post<AskResponse>('/nlweb/ask/proxy', request)
      .pipe(
        map(response => {
          console.log('AskService: Received response:', response);
          return this.normalizeNLWebResponse(response);
        }),
        catchError(error => {
          console.error('AskService: Error calling Ask proxy:', error);
          return throwError(() => new Error('Failed to get answer from Ask service'));
        })
      );
  }

  /**
   * Ask a question with streaming support
   * @param request - The ask request parameters
   * @returns Observable of AskResponse
   */
  askQuestionStreaming(request: AskRequest): Observable<AskResponse> {
    console.log('AskService: Making streaming request to /nlweb/ask/proxy with:', request);
    
    // Use the proxy service for streaming as well
    return this.http.post<AskResponse>('/nlweb/ask/proxy', request)
      .pipe(
        map(response => {
          console.log('AskService: Received streaming response:', response);
          return this.normalizeNLWebResponse(response);
        }),
        catchError(error => {
          console.error('AskService: Error calling Ask streaming proxy:', error);
          return throwError(() => new Error('Failed to get streaming answer from Ask service'));
        })
      );
  }

  /**
   * Normalize NLWeb response from different tools into unified structure
   * Handles responses from Search, Details, Ensemble, and other NLWeb tools
   * @param response - Raw response from NLWeb
   * @returns Normalized response
   */
  private normalizeNLWebResponse(response: any): AskResponse {
    console.log('AskService: Normalizing NLWeb response:', response);
    console.log('AskService: Input results count:', response.results ? response.results.length : 0);
    
    const normalizedResponse: AskResponse = {
      message_type: response.message_type || 'result_batch',
      query_id: response.query_id,
      tool_selection: response.tool_selection,
      remember: response.remember,
      ensemble_info: response.ensemble_info,
      results: []
    };

    // Normalize results array
    if (response.results && Array.isArray(response.results)) {
      console.log('AskService: Processing', response.results.length, 'results');
      const mapped = response.results.map((result: any, index: number) => {
        console.log('AskService: Normalizing result', index, ':', result.name);
        return this.normalizeResult(result, index);
      });
      // Filter out non-meaningful placeholder results
      normalizedResponse.results = mapped.filter((r: AskResult) => this.isMeaningfulResult(r));
      console.log('AskService: Normalized results count:', normalizedResponse.results.length);
    } else {
      console.log('AskService: No results found in response or results is not an array');
    }

    console.log('AskService: Final normalized response:', normalizedResponse);
    return normalizedResponse;
  }

  /**
   * Normalize individual result from NLWeb tool response
   * @param result - Raw result from NLWeb
   * @param index - Index of the result for ID generation
   * @returns Normalized AskResult
   */
  private normalizeResult(result: any, index: number): AskResult {
    const schemaObject = result.schema_object || result;
    
    // Extract content metadata from schema_object
    const contentMetadata = this.extractContentMetadata(schemaObject);
    
    // Generate unique ID if not present
    const id = result.id || `ask_result_${Date.now()}_${index}`;
    
    // Normalize score to 0-100 range
    const normalizedScore = this.normalizeScore(result.score);
    
    // Determine content type
    const contentType = this.determineContentType(result, schemaObject);
    
    return {
      // Core identification
      id: id,
      name: result.name || result.title || 'Untitled',
      url: result.url || '',
      
      // Content information
      description: result.description || result.snippet || '',
      snippet: result.snippet || result.description || '',
      type: contentType,
      category: result.category || '',
      
      // Scoring and relevance
      score: normalizedScore,
      relevance: normalizedScore, // Use score as relevance for now
      
      // Media and presentation
      thumbnail: result.thumbnail || result.image || schemaObject.thumbnailUrl || '',
      image: result.image || schemaObject.thumbnailUrl || '',
      
      // Educational metadata
      medium: contentMetadata.medium,
      subject: contentMetadata.subject,
      grade: contentMetadata.grade,
      board: contentMetadata.board,
      
      // Recommendations and explanations
      recommendation: result.recommendation || result.why_recommended || '',
      why_recommended: result.why_recommended || result.recommendation || '',
      
      // Technical metadata
      schema_object: schemaObject,
      details: result.details || {},
      site: result.site || '',
      
      // Ensemble-specific fields
      ensemble_theme: result.ensemble_theme,
      ensemble_tips: result.ensemble_tips,
      ensemble_type: result.ensemble_type,
      total_items_retrieved: result.total_items_retrieved
    };
  }

  /**
   * Determine if a normalized result is meaningful enough to render
   * Filters out placeholders like "Untitled" with empty url/description and 0 score
   */
  private isMeaningfulResult(result: AskResult): boolean {
    const hasName = !!(result.name && result.name.trim() && result.name.trim().toLowerCase() !== 'untitled');
    const hasUrl = !!(result.url && result.url.trim());
    const hasDesc = !!(result.description && result.description.trim());
    const hasSnippet = !!(result.snippet && result.snippet.trim());
    const hasScore = typeof result.score === 'number' && result.score > 0;
    // Consider meaningful if it has name + (url or description/snippet) or a positive score
    return hasName && (hasUrl || hasDesc || hasSnippet || hasScore);
  }

  /**
   * Extract content metadata from schema object
   * @param schemaObject - The schema object containing content metadata
   * @returns Object with extracted metadata
   */
  private extractContentMetadata(schemaObject: any): {
    medium: string;
    subject: string[];
    grade: string[];
    board: string[];
  } {
    if (!schemaObject) {
      return {
        medium: '',
        subject: [],
        grade: [],
        board: []
      };
    }

    return {
      medium: this.extractMedium(schemaObject),
      subject: this.extractSubject(schemaObject),
      grade: this.extractGrade(schemaObject),
      board: this.extractBoard(schemaObject)
    };
  }

  /**
   * Normalize score to 0-100 range
   * @param score - Raw score value
   * @returns Normalized score (0-100)
   */
  private normalizeScore(score: any): number {
    if (!score) return 0;
    
    let numScore = typeof score === 'string' ? parseFloat(score) : score;
    
    if (isNaN(numScore)) return 0;
    
    // If score is in decimal format (0-1), convert to percentage (0-100)
    if (numScore > 0 && numScore <= 1) {
      numScore = numScore * 100;
    }
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(numScore)));
  }

  /**
   * Determine content type from result and schema object
   * @param result - The result object
   * @param schemaObject - The schema object
   * @returns Content type string
   */
  private determineContentType(result: any, schemaObject: any): string {
    // Check explicit type first
    if (result.type) {
      return result.type.toLowerCase();
    }
    
    // Check encoding format
    if (schemaObject.encodingFormat) {
      const format = schemaObject.encodingFormat.toLowerCase();
      if (format.includes('video') || format.includes('mp4')) return 'video';
      if (format.includes('pdf') || format.includes('application/pdf')) return 'pdf';
      if (format.includes('textbook') || format.includes('etextbook')) return 'etextbook';
      if (format.includes('presentation') || format.includes('ppt')) return 'presentation';
      if (format.includes('audio') || format.includes('mp3')) return 'audio';
      if (format.includes('interactive') || format.includes('h5p')) return 'interactive';
    }
    
    // Check genre
    if (schemaObject.genre && Array.isArray(schemaObject.genre)) {
      const genre = schemaObject.genre.find((g: string) => 
        g.toLowerCase().includes('video') || 
        g.toLowerCase().includes('pdf') || 
        g.toLowerCase().includes('textbook') ||
        g.toLowerCase().includes('presentation')
      );
      if (genre) {
        return this.formatMediumName(genre).toLowerCase();
      }
    }
    
    // Check URL for hints
    if (result.url) {
      if (result.url.includes('youtube.com') || result.url.includes('video')) return 'video';
      if (result.url.includes('.pdf') || result.url.includes('pdf')) return 'pdf';
      if (result.url.includes('course') || result.url.includes('learn')) return 'course';
    }
    
    // Default to content
    return 'content';
  }

  /**
   * Extract medium/format from schema object
   * @param schemaObject - The schema object containing content metadata
   * @returns Medium string
   */
  private extractMedium(schemaObject: any): string {
    if (!schemaObject) return '';
    
    // Check encodingFormat first
    if (schemaObject.encodingFormat) {
      return this.formatMediumName(schemaObject.encodingFormat);
    }
    
    // Check genre for content type
    if (schemaObject.genre && Array.isArray(schemaObject.genre)) {
      const genre = schemaObject.genre.find((g: string) => 
        g.toLowerCase().includes('video') || 
        g.toLowerCase().includes('pdf') || 
        g.toLowerCase().includes('textbook') ||
        g.toLowerCase().includes('presentation')
      );
      if (genre) {
        return this.formatMediumName(genre);
      }
    }
    
    return '';
  }

  /**
   * Extract subject from educational alignment
   * @param schemaObject - The schema object containing content metadata
   * @returns Array of subject strings
   */
  private extractSubject(schemaObject: any): string[] {
    if (!schemaObject || !schemaObject.educationalAlignment) return [];
    
    return schemaObject.educationalAlignment
      .filter((alignment: any) => alignment.alignmentType === 'subject')
      .map((alignment: any) => alignment.targetName)
      .filter((subject: string) => subject && subject.trim());
  }

  /**
   * Extract grade level from educational alignment
   * @param schemaObject - The schema object containing content metadata
   * @returns Array of grade strings
   */
  private extractGrade(schemaObject: any): string[] {
    if (!schemaObject || !schemaObject.educationalAlignment) return [];
    
    return schemaObject.educationalAlignment
      .filter((alignment: any) => alignment.alignmentType === 'educationalLevel')
      .map((alignment: any) => alignment.targetName)
      .filter((grade: string) => grade && grade.trim());
  }

  /**
   * Extract board from educational alignment
   * @param schemaObject - The schema object containing content metadata
   * @returns Array of board strings
   */
  private extractBoard(schemaObject: any): string[] {
    if (!schemaObject || !schemaObject.educationalAlignment) return [];
    
    return schemaObject.educationalAlignment
      .filter((alignment: any) => alignment.alignmentType === 'board')
      .map((alignment: any) => alignment.targetName)
      .filter((board: string) => board && board.trim());
  }

  /**
   * Format medium name for display
   * @param medium - Raw medium string
   * @returns Formatted medium string
   */
  private formatMediumName(medium: string): string {
    if (!medium) return '';
    
    const mediumLower = medium.toLowerCase();
    
    if (mediumLower.includes('video') || mediumLower.includes('mp4')) {
      return 'Video';
    } else if (mediumLower.includes('pdf') || mediumLower.includes('application/pdf')) {
      return 'PDF';
    } else if (mediumLower.includes('textbook') || mediumLower.includes('etextbook')) {
      return 'eTextbook';
    } else if (mediumLower.includes('presentation') || mediumLower.includes('ppt')) {
      return 'Presentation';
    } else if (mediumLower.includes('audio') || mediumLower.includes('mp3')) {
      return 'Audio';
    } else if (mediumLower.includes('interactive') || mediumLower.includes('h5p')) {
      return 'Interactive';
    }
    
    return medium;
  }

  /**
   * Get available sites from NLWeb
   * @returns Observable of sites array
   */
  getAvailableSites(): Observable<string[]> {
    return this.http.get<{sites: string[]}>('/nlweb/ask/sites')
      .pipe(
        map(response => response.sites || []),
        catchError(error => {
          console.error('Error getting sites from NLWeb:', error);
          return throwError(() => new Error('Failed to get available sites'));
        })
      );
  }

  /**
   * Check if NLWeb service is available
   * @returns Observable of boolean
   */
  checkServiceHealth(): Observable<boolean> {
    return this.http.get('/nlweb/ask/health')
      .pipe(
        map(() => true),
        catchError(() => {
          console.warn('NLWeb service is not available');
          return throwError(() => new Error('NLWeb service is not available'));
        })
      );
  }

  /**
   * Get normalized result for display in UI
   * @param result - Raw result from NLWeb
   * @returns Normalized result for UI display
   */
  getNormalizedResult(result: any): AskResult {
    return this.normalizeResult(result, 0);
  }

  /**
   * Sort results by score in descending order
   * @param results - Array of results to sort
   * @returns Sorted array of results
   */
  sortResultsByScore(results: AskResult[]): AskResult[] {
    return results.sort((a, b) => {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return scoreB - scoreA; // Descending order
    });
  }

  /**
   * Filter results by content type
   * @param results - Array of results to filter
   * @param type - Content type to filter by
   * @returns Filtered array of results
   */
  filterResultsByType(results: AskResult[], type: string): AskResult[] {
    return results.filter(result => 
      result.type && result.type.toLowerCase() === type.toLowerCase()
    );
  }

  /**
   * Filter results by minimum score
   * @param results - Array of results to filter
   * @param minScore - Minimum score threshold
   * @returns Filtered array of results
   */
  filterResultsByScore(results: AskResult[], minScore: number): AskResult[] {
    return results.filter(result => (result.score || 0) >= minScore);
  }
}
