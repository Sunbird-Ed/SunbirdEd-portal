import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { Singleton } from 'typescript-ioc';

export interface IHttpRequestConfig extends AxiosRequestConfig {
}

export interface IHttpResponse extends AxiosResponse {
}
/**
 * 
 * 
 * @export
 * @class HTTPService
 */
@Singleton
export class HTTPService {
  /**
   * 
   * 
   * @param {string} url 
   * @param {IHttpRequestConfig} config 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static get(url: string, config: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.get(url, config));
  }
  /**
   * 
   * 
   * @param {string} url 
   * @param {IHttpRequestConfig} [config] 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static delete(url: string, config?: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.delete(url, config));
  }
  /**
   * 
   * 
   * @param {string} url 
   * @param {IHttpRequestConfig} [config] 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static head(url: string, config?: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.head(url, config));
  }
  /**
   * 
   * 
   * @param {string} url 
   * @param {*} [data] 
   * @param {IHttpRequestConfig} [config] 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static post(url: string, data?: any, config?: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.post(url, data, config));
  }
  /**
   * 
   * 
   * @param {string} url 
   * @param {*} [data] 
   * @param {IHttpRequestConfig} [config] 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static put(url: string, data?: any, config?: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.put(url, data, config));
  }
  /**
   * 
   * 
   * @param {string} url 
   * @param {*} [data] 
   * @param {IHttpRequestConfig} [config] 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static patch(url: string, data?: any, config?: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.patch(url, data, config));
  }
  /**
   * 
   * 
   * @param {IHttpRequestConfig} config 
   * @returns {Observable<IHttpResponse>} 
   * @memberof HTTPService
   */
  public static request(config: IHttpRequestConfig): Observable<IHttpResponse> {
    return fromPromise(Axios.request(config));
  }
}