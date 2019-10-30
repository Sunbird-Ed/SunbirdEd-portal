import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './../../services/connection-service/connection.service';
import { ActivatedRoute } from '@angular/router';
import {ResourceService} from '@sunbird/shared';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  isConnected = navigator.onLine;

    /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;

  constructor(private connectionService: ConnectionService, resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

}
