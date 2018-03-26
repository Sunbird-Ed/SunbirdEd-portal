import { UserService } from './../user/user.service';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService, ServerResponse, UserProfile } from '@sunbird/shared';



/**
 * Service to provides CRUD methods to make content api request by extending DataService.
 *
 */
@Injectable()
export class EditorService extends DataService {
    /**
     * base Url for content api
     */
    baseUrl: string;
    /**
     * reference of config service.
     */
    public config: ConfigService;
    /**
   reference of userService
   */
    public user: UserService;
    /**
     * reference of lerner service.
     */

    public http: HttpClient;
    public creator: string;
    public createdBy: string;
    public createdFor: string;
    public organization: string;

    /**
     * constructor
     * @param {ConfigService} config ConfigService reference
     * @param {HttpClient} http HttpClient reference
     */
    constructor(config: ConfigService, http: HttpClient, user: UserService) {
        super(http);
        this.config = config;
        this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
        this.user = user;
    }
    
    
    userDetails(){
        this.user.userData$.subscribe((data) => {
            // console.log("editor service", data);
            return data;
        }),
        err => {
            console.log("Error in user details fetching");
        }
    }

    create(req) {
        this.user.userData$.subscribe((data) => {
            console.log("user data: ", data);
            req.content.sessionId = data.userProfile.sessionId;
            req.content.userRoles = data.userProfile.userRoles;            
            if (data && data.userProfile && data.userProfile.rootOrgId) {
                this.rootOrgId = data.userProfile.rootOrgId;
                 req.content.creator = data.userProfile.firstName + ' ' + data.userProfile.lastName;
                req.content.createdBy = data.userProfile.id;
                req.content.createdFor = data.userProfile.organisationIds;
                req.content.organization = data.userProfile.organisationIds;
            } else {
                console.log('Root org id not found');
            }
        });

        const option = {
            url: this.config.urlConFig.URLS.CONTENT.CREATE,
            data: {
                'request': req
            }

        };

        // console.log("option: ", option);
        return this.post(option);
    }

    getById(req, qs) {
        const option = {
            url : this.config.urlConFig.URLS.CONTENT.GET + '/' + req.contentId,
            data:{
                req : req,
                qs: qs
            }
        }
        
        return this.get(option)
      }
 
}

