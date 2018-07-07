import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Ibatch } from './../../interfaces';
import { WorkSpaceService, BatchService } from '../../services';
/**
* This display a batch card
*/
@Component({
  selector: 'app-batch-card',
  templateUrl: './batch-card.component.html',
  styleUrls: ['./batch-card.component.css']
})
export class BatchCardComponent {
  /**
  * To navigate to other pages
  */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  public activatedRoute: ActivatedRoute;
  /**
    * Reference for WorkSpaceService
  */
  public workSpaceService: WorkSpaceService;
  /**
    * Reference for BatchService
  */
  public batchService: BatchService;
  /**
   * batch is used to render Ibatch value on the view
  */
  @Input() batch: Ibatch;
  // @Output('clickEvent')
  // clickEvent = new EventEmitter<any>();

  /**
  * Constructor to create injected service(s) object
  * Default method of batch card  Component class
  *@param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
  *@param {BatchService} BatchService Reference of WorkSpaceService
  * @param {Router} route Reference of Router
  * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
  */
  constructor(workSpaceService: WorkSpaceService,
    batchService: BatchService,
    activatedRoute: ActivatedRoute,
    route: Router) {
    this.batchService = batchService;
    this.route = route;
    this.activatedRoute = activatedRoute;
  }
  public onAction(batchdata) {
    this.batchService.setBatchData(batchdata);
    this.route.navigate(['update/batch', batchdata.identifier], {relativeTo: this.activatedRoute});
  }

}
