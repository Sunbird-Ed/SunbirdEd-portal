import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Ibatch } from './../../interfaces';
import { ResourceService } from '../../services/index';

/**
* This display a batch card
*/
@Component({
  selector: 'app-batch-card',
  templateUrl: './batch-card.component.html',
  styleUrls: ['./batch-card.component.scss']
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
   * batch is used to render Ibatch value on the view
  */
  @Input() batch: Ibatch;
  @Output() clickEvent = new EventEmitter<any>();

  /**
  * Constructor to create injected service(s) object
  * Default method of batch card  Component class
  *@param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
  *@param {BatchService} BatchService Reference of WorkSpaceService
  * @param {Router} route Reference of Router
  * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
  */
  constructor(public resourceService: ResourceService,
    activatedRoute: ActivatedRoute,
    route: Router) {
    this.route = route;
    this.activatedRoute = activatedRoute;
  }

  public onAction(batchdata) {
    this.clickEvent.emit({ 'action': 'batchcardclick', 'data': batchdata });
  }

}
