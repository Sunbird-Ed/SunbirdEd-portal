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

  public fetchCertificates(params) {
    const request = {
      request: {
        _source: ['data.badge.issuer.name', 'pdfUrl', 'data.issuedOn', 'data.badge.name'],
        query: {
          bool: {
            must: [
              {
                match_phrase: {
                  'recipient.id': params.userId
                }
              }
            ]
          }
        }
      }
    };
    if (params.certType && params.certType !== 'all') {
      request.request.query.bool.must[0].match_phrase['related.type'] = params.certType;
    }
    if (params.limit) {
      request.request['size'] = params.limit;
    }
    const options = {
      url: this.config.urlConFig.URLS.CERTIFICATE.FETCH_CERTIFICATES,
      data: request,
    };
    return this.post(options);
  }

  public getUserCertList(userName, courseId, loggedInUser) {
    const request = {
      request: {
        filters: {
          userName: userName,
          courseId: courseId,
          createdBy: loggedInUser,
        }
      }
    };
    const options = {
      url: this.config.urlConFig.URLS.CERTIFICATE.FETCH_USER,
      data: request,
    };
    return this.post(options);
  }

  public reIssueCertificate(request) {
    const options = {
      url: `${this.config.urlConFig.URLS.CERTIFICATE.REISSUE_CERTIFICATE}`,
      data: request,
    };
    return this.post(options);
  }

  public addCertificateTemplate(request) {
    const options = {
      url: `${this.config.urlConFig.URLS.CERTIFICATE.ATTACH_CERTIFICATE}`,
      data: request,
    };
    return this.patch(options);
  }

  public checkCriteria(batchData) {
    if (batchData.length && batchData[0].status === 2) {
      return true;
    }
    return false;
  }

  public getCertLayouts(request) {
    const options = {
      url: `${this.config.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: request,
    };
    return this.post(options);
  }
}
