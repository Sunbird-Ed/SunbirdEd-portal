import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from '../../shared';

/**
 * AskProxyService - Handles proxying requests to NLWeb service
 * This service provides a proxy layer to handle CORS and routing issues
 */
@Injectable({
  providedIn: 'root'
})
export class AskProxyService {
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  /**
   * Proxy ask request through Sunbird backend
   * @param query - The search query
   * @param params - Additional parameters
   * @returns Observable of the response
   */
  askQuestion(query: string, params: any = {}): Observable<any> {
    const requestBody = {
      query: query,
      ...params
    };

    // Use Sunbird's backend to proxy the request to NLWeb
    return this.http.post('/api/ask/proxy', requestBody)
      .pipe(
        map(response => this.transformResponse(response)),
        catchError(error => {
          console.error('Error calling Ask proxy:', error);
          return throwError(() => new Error('Failed to get answer from Ask service'));
        })
      );
  }

  /**
   * Transform the response to match expected format
   * @param response - Raw response from proxy
   * @returns Transformed response
   */
  private transformResponse(response: any): any {
    // Transform response to match AskResult format
    if (response.results && Array.isArray(response.results)) {
      response.results = response.results.map((result: any) => ({
        name: result.name || result.title || 'Untitled',
        url: result.url || '',
        description: result.description || result.snippet || '',
        snippet: result.snippet || result.description || '',
        score: result.score || 0,
        type: result.type || 'content',
        thumbnail: result.thumbnail || result.image || '',
        schema_object: result.schema_object || result,
        recommendation: result.recommendation || result.why_recommended || ''
      }));
    }

    return response;
  }
}
