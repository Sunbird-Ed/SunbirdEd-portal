import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

interface FormServiceConfig {
    formType: string;
    formAction: string;
    contentType: string;
    framework?: string;
    component?: string;
}

interface UrlHistory {
  url: string;
  queryParams?: any;
}

interface appConfig {
    PLAYER_CONFIG: {
        MIME_TYPE: {
            questionset: string;
        };
        baseURL: string;
        localBaseUrl: string;
        cdnUrl: string;
    }
}

interface urlConFig {
        URLS: {
            TELEMETRY: {
                SYNC: string;
              }
        }
}

export interface ConfigService {
    appConfig:  appConfig;
    urlConFig: urlConFig;
}

export interface NavigationHelperService {
  emitFullScreenEvent(value: any): void;
  handleContentManagerOnFullscreen(value: any): void;
  contentFullScreenEvent: EventEmitter<any>;
  history: Array<UrlHistory>;
}

export interface UtilService {
    isDesktopApp: boolean;
}

export interface PlayerConfig {
    config: any;
    context: any;
    data: any;
    metadata: any;
}

export interface ToasterService {
    success(message: string): void;
    info(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    custom(config: any): void;
}

export interface ResourceService {
    instance: string;
}

export interface ContentUtilsServiceService {
  contentShareEvent: EventEmitter<any>;
}

export interface IInteractEventEdata {
    'id': string;
    'type': string;
    'subtype'?: string;
    'pageid'?: string;
    'extra'?: {};
    'target'?: string;
    'plugin'?: string;
}  

export interface UserService {
    loggedIn: boolean;
    userData$: Observable<Partial<any>>;
    guestUserProfile: any;
}

export interface FormService {
    getFormConfig(formInputParams: FormServiceConfig, hashTagId?: string, responseKey?: string): Observable<any>;
}

export interface ContentService {
    post(input): Observable<any>;
}
export interface LayoutService{
    
}
export interface PublicPlayerService {
    getQuestionSetRead(contentId: string, option?: any): Observable<any>;
}

export interface ContentData {
    creator?: string;
    contributors?: string;
    attributions?: Array<string>;
    creators?: string;
    owner?: string;
    copyright?: string;
}

export interface ContentCreditsData {
    contributors: string;
    creators: string;
    attributions: string;
    copyright?: string;
}

export interface ContentpageService {
    getconfigService(): ConfigService; 
    getnavigationHelperService(): NavigationHelperService; 
    getutilService(): UtilService; 
    gettoasterService(): ToasterService; 
    getresourceService(): ResourceService; 
    getcontentUtilsServiceService(): ContentUtilsServiceService; 
    getuserService(): UserService; 
    getformService(): FormService; 
    getpublicPlayerService(): PublicPlayerService; 
    getcontentService(): ContentService; 
    getlayoutService(): LayoutService;
}