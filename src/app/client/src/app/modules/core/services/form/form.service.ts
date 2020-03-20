
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import { ConfigService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { Observable, of } from 'rxjs';
import { PublicDataService } from './../public-data/public-data.service';
import { CacheService } from 'ng2-cache-service';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  /**
   * Reference of user service.
   */
  public userService: UserService;
  /**
   * Reference of config service
   */
  public configService: ConfigService;

  /**
   * Reference of public data service
   */
  public publicDataService: PublicDataService;

  /**
   * Default method of OrganisationService class
   *
   * @param {PublicDataService} publicDataService content service reference
   */
  constructor(userService: UserService, configService: ConfigService, publicDataService: PublicDataService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
  }

  /**
    * @param {formType} content form type
    * @param {formAction} content form action type
    * @param {selectedContent} content selected content type
    */
  getFormConfig(formInputParams, hashTagId?: string): Observable<any> {
    const channelOptions: any = {
      url: this.configService.urlConFig.URLS.dataDrivenForms.READ,
      data: {
        request: {
          type: formInputParams.formType,
          action: formInputParams.formAction,
          subType: this.configService.appConfig.formApiTypes[formInputParams.contentType]
          ? this.configService.appConfig.formApiTypes[formInputParams.contentType]
          : formInputParams.contentType,
          rootOrgId: hashTagId ? hashTagId : this.userService.hashTagId
        }
      }
    };
    const formKey = `${channelOptions.data.request.type}${channelOptions.data.request.action}
    ${channelOptions.data.request.subType}${channelOptions.data.request.rootOrgId}${formInputParams.framework}`;
     const key = btoa(formKey);
    if (this.cacheService.get(key)) {
      const data = this.cacheService.get(key);
      return of(data);
    } else {
      if (formInputParams.framework) {
        channelOptions.data.request.framework = formInputParams.framework;
      }
      return this.publicDataService.post(channelOptions).pipe(map(
        (formConfig: ServerResponse) => {
          if (formConfig.result.form.action === 'create' && formConfig.result.form.subtype === 'resource') {
            formConfig = {
              "id": "api.form.read",
              "params": {
                "resmsgid": "0228c499-3c39-419b-9791-18dfa40dbeaa",
                "msgid": "aa8821b7-df70-4b7b-a1ec-083be6231ad6",
                "status": "successful"
              },
              "responseCode": "OK",
              "result": {
                "form": {
                  "type": "content",
                  "subtype": "resource",
                  "action": "create",
                  "component": "*",
                  "framework": "*",
                  "data": {
                    "templateName": "defaultTemplate",
                    "action": "create",
                    "fields": [
                      {
                        "code": "name",
                        "visible": true,
                        "editable": true,
                        "displayProperty": "Editable",
                        "dataType": "text",
                        "renderingHints": {
                          "semanticColumnWidth": "twelve"
                        },
                        "description": "Name",
                        "index": 1,
                        "label": "Name",
                        "required": false,
                        "name": "Name",
                        "inputType": "text",
                        "placeholder": "Name"
                      },
                      {
                        "code": "board",
                        "visible": true,
                        "depends": [
                          "medium",
                          "gradeLevel",
                          "subject",
                          "topic"
                        ],
                        "editable": true,
                        "displayProperty": "Editable",
                        "dataType": "text",
                        "renderingHints": {
                          "semanticColumnWidth": "six"
                        },
                        "description": "Education Board (Like MP Board, NCERT, etc)",
                        "index": 2,
                        "label": "Board",
                        "required": false,
                        "name": "Board",
                        "inputType": "select",
                        "placeholder": "Board"
                      },
                      {
                        "code": "medium",
                        "visible": true,
                        "depends": [
                          "gradeLevel",
                          "subject",
                          "topic"
                        ],
                        "editable": true,
                        "dataType": "list",
                        "renderingHints": {
                          "semanticColumnWidth": "six"
                        },
                        "description": "Medium of instruction",
                        "index": 3,
                        "label": "Medium",
                        "required": false,
                        "name": "Medium",
                        "inputType": "multiSelect",
                        "placeholder": "Medium"
                      },
                      {
                        "code": "gradeLevel",
                        "visible": true,
                        "depends": [
                          "subject",
                          "topic"
                        ],
                        "editable": true,
                        "dataType": "list",
                        "renderingHints": {
                          "semanticColumnWidth": "six"
                        },
                        "description": "Grade",
                        "index": 4,
                        "label": "Grade",
                        "required": false,
                        "name": "Grade",
                        "inputType": "multiSelect",
                        "placeholder": "Grade"
                      },
                      {
                        "code": "subject",
                        "visible": true,
                        "editable": true,
                        "dataType": "list",
                        "renderingHints": {
                          "semanticColumnWidth": "six"
                        },
                        "name": "Subject",
                        "description": "Subject of the Content to use to teach",
                        "index": 5,
                        "inputType": "multiSelect",
                        "label": "Subject",
                        "placeholder": "Grade",
                        "required": false
                      },
                      {
                        "code": "contentType",
                        "visible": true,
                        "editable": true,
                        "dataType": "text",
                        "description": "Content Type",
                        "index": 7,
                        "range": [
                          {
                            "name": "Lesson Plan",
                            "value": "LessonPlan"
                          },
                          {
                            "name": "Explanation Resource",
                            "value": "ExplanationResource"
                          },
                          {
                            "name": "Learning Outcome Definition",
                            "value": "LearningOutcomeDefinition"
                          },
                          {
                            "name": "Practice Resource",
                            "value": "PracticeResource"
                          }
                        ],
                        "defaultValue": "",
                        "label": "Content Type",
                        "required": true,
                        "name": "contentType",
                        "inputType": "select",
                        "placeholder": "Content Type",
                        "renderingHints": {
                          "semanticColumnWidth": "six"
                        }
                      }
                    ]
                  },
                  "created_on": "2019-01-27T18:35:42.991Z",
                  "last_modified_on": "2020-03-06T08:59:48.660Z",
                  "rootOrgId": "*"
                }
              },
              "ts": "2020-03-20T09:56:33.558Z",
              "ver": "1.0"
            };
            this.setForm(formKey, formConfig.result.form.data.fields);
            return formConfig.result.form.data.fields;
          } else {
            this.setForm(formKey, formConfig.result.form.data.fields);
            return formConfig.result.form.data.fields;
          }
        }));
    }
  }

  setForm(formKey, formData) {
     const key = btoa(formKey);
     this.cacheService.set(key, formData,
      {maxAge: this.browserCacheTtlService.browserCacheTtl});
  }
}
