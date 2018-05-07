import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SearchParam } from '@sunbird/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-dial-code',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.css']
})
export class DialCodeComponent implements OnInit {

  /**
   * reference of SearchService
   */
  private searchService: SearchService;


  /**
   * reference of ToasterService
   */
  private toasterService: ToasterService;

  /**
  * reference of ResourceService
  */
  public resourceService: ResourceService;
  /**
   * used to store insatnce name
   */
  public instanceName;
  /**
   * used to store searched keyword
   */
  public dialCode;
  /**
   * used to store searched keyword
   */
  public searchKeyword;
  /**
  * To navigate to other pages
   */
  public router: Router;

  /**
   * To send activatedRoute.snapshot to routerNavigationService
   */
  public activatedRoute: ActivatedRoute;

  /**
  * This variable hepls to show and hide page loader.
  * It is kept true by default as at first when we comes
  * to a page the loader should be displayed before showing
  * any data
  */
  showLoader = true;

  /**
    * loader message
   */
  loaderMessage: any;

  /**
   * to store search results
   */
  searchResults: Array<any>;

  constructor(resourceService: ResourceService, router: Router, activatedRoute: ActivatedRoute,
    searchService: SearchService, toasterService: ToasterService) {
    this.resourceService = resourceService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.searchService = searchService;
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.instanceName = this.resourceService.instance;
    this.activatedRoute.params.subscribe(params => {
      this.searchResults = [];
      this.searchKeyword = this.dialCode = params.dialCode;
      this.searchDialCode();
    });
  }

  private searchDialCode() {
    this.showLoader = true;
    const searchParams: SearchParam = {
      filters: {
        'dialcodes': this.dialCode
      }
    };
    this.searchService.compositeSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        if (apiResponse.result.content && apiResponse.result.content.length > 0) {
          this.searchResults = apiResponse.result.content;
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0015);
        }
      },
      err => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0015);
      }
    );
  }

  public navigateToSearch() {
    if (this.searchKeyword.length > 0) {
      this.router.navigate(['/get/dial/' + this.searchKeyword]);
    }
  }

}
