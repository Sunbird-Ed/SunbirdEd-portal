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
  [key: string]: any;
}

/**
 * Interface for individual search results
 */
export interface AskResult {
  name: string;
  url: string;
  description?: string;
  snippet?: string;
  score?: number;
  type?: string;
  thumbnail?: string;
  schema_object?: any;
  recommendation?: string;
  // Content metadata fields
  medium?: string;
  subject?: string[];
  grade?: string[];
  board?: string[];
}

/**
 * AskService - Handles integration with NLWeb ensemble tool
 * This service provides methods to query the ensemble tool and get educational content recommendations
 */
@Injectable({
  providedIn: 'root'
})
export class AskService {
  
  private nlwebBaseUrl: string;
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // Get NLWeb server URL from configuration
    this.nlwebBaseUrl = this.configService.urlConFig.URLS.NLWEB_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Ask a question using the ensemble tool
   * @param request - The ask request parameters
   * @returns Observable of AskResponse
   */
  askQuestion(request: AskRequest): Observable<AskResponse> {
    console.log('AskService: Making request to /api/ask/proxy with:', request);
    
    // Use the proxy service instead of direct calls
    return this.http.post<AskResponse>('/api/ask/proxy', request)
      .pipe(
        map(response => {
          console.log('AskService: Received response:', response);
          return this.transformResponse(response);
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
    const params = new HttpParams()
      .set('query', request.query)
      .set('site', request.site || 'all')
      .set('model', request.model || 'gpt-4o-mini')
      .set('streaming', 'True')
      .set('generate_mode', request.generate_mode || 'none')
      .set('oauth_id', request.oauth_id || '')
      .set('thread_id', request.thread_id || '');

    return this.http.get<AskResponse>(`${this.nlwebBaseUrl}/ask`, { 
      params,
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    }).pipe(
      map(response => this.transformResponse(response)),
      catchError(error => {
        console.error('Error calling NLWeb streaming API:', error);
        return throwError(() => new Error('Failed to get streaming answer from Ask service'));
      })
    );
  }

  /**
   * Transform the response from NLWeb to match Sunbird format
   * @param response - Raw response from NLWeb
   * @returns Transformed response
   */
  private transformResponse(response: any): AskResponse {
    // Transform NLWeb results to Sunbird format
    if (response.results && Array.isArray(response.results)) {
      response.results = response.results.map((result: any) => {
        const schemaObject = result.schema_object || result;
        
        // Extract content metadata from schema_object
        const medium = this.extractMedium(schemaObject);
        const subject = this.extractSubject(schemaObject);
        const grade = this.extractGrade(schemaObject);
        const board = this.extractBoard(schemaObject);
        
        return {
          name: result.name || result.title || 'Untitled',
          url: result.url || '',
          description: result.description || result.snippet || '',
          snippet: result.snippet || result.description || '',
          score: result.score || 0,
          type: result.type || 'content',
          thumbnail: result.thumbnail || result.image || '',
          schema_object: schemaObject,
          recommendation: result.recommendation || result.why_recommended || '',
          // Content metadata
          medium: medium,
          subject: subject,
          grade: grade,
          board: board
        };
      });
    }

    return response;
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
    return this.http.get<{sites: string[]}>(`${this.nlwebBaseUrl}/sites`)
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
    return this.http.get(`${this.nlwebBaseUrl}/who`)
      .pipe(
        map(() => true),
        catchError(() => {
          console.warn('NLWeb service is not available');
          return throwError(() => new Error('NLWeb service is not available'));
        })
      );
  }
}
