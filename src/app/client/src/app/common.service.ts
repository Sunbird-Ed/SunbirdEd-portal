import { Injectable } from '@angular/core';
import { ConfigService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { ToasterService, ResourceService, ContentUtilsServiceService } from '@sunbird/shared';
import { LayoutService } from '@sunbird/shared';
import { UserService, FormService } from '@sunnbird/core';
import { ContentService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';


@Injectable({
  providedIn: 'platform'
})
export class contentpageService {

  constructor(public ConfigService: ConfigService, public toasterService: ToasterService, public layoutService:LayoutService,
    public ResourceService: ResourceService, public NavigationHelperService: NavigationHelperService,
    private UserService: UserService, public FormService: FormService
    , public ContentUtilsServiceService: ContentUtilsServiceService, private ContentService: ContentService,
   public PlayerService: PublicPlayerService, private UtilService: UtilService) { 

   }

   getconfigService(): ConfigService {
    return this.ConfigService;
  }
  getnavigationHelperService(): NavigationHelperService {
    return this.NavigationHelperService;
  }
  getutilService(): UtilService {
    return this.UtilService;
  }
  gettoasterService(): ToasterService {
    return this.toasterService;
  }
  getresourceService(): ResourceService {
    return this.ResourceService;
  }
  getcontentUtilServiceService(): ContentUtilsServiceService {
    return this.ContentUtilsServiceService;
  }
  getuserService(): UserService {
    return this.UserService;
  }

  getformService(): FormService {
    return this.FormService;
  }

  getcontentService(): ContentService {
    return this.ContentService;
  }

  getpublicPlayerService(): PublicPlayerService {
    return this.PlayerService;
  }
  getlayoutService(): LayoutService{
    return this.layoutService;
  }

}