import { Injectable } from '@angular/core';
import {ConfigService} from '@sunbird/shared';
import {DataService} from './../data/data.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CertRegService extends DataService {

  /**
   * base Url for cert-reg api
   */
  baseUrl: string;

  /**
   * reference of config service.
   */
  public config: ConfigService;

  /**
   * reference of lerner service.
   */
  public http: HttpClient;

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CERT_REG_PREFIX;
  }

  public fetchCertificates(userId, certType) {
    const request = {
      request: {
        _source: ['data.badge.issuer.name', 'pdfUrl', 'data.issuedOn', 'data.badge.name'],
        query: {
          bool: {
            must: [
              {
                match_phrase: {
                  'recipient.id': userId
                }
              },
              {
                match_phrase: {
                  'related.type': certType
                }
              }
            ]
          }
        }
      }
    };
    const options = {
      url: this.config.urlConFig.URLS.CERTIFICATE.FETCH_CERTIFICATES,
      data: request,
    };
    return this.post(options);
  }
}
