import { ExtPluginService } from './../../../core/services/ext-plugin/ext-plugin.service';
import { FormService } from '@sunbird/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-onboard-popup',
  templateUrl: './onboard-popup.component.html',
  styleUrls: ['./onboard-popup.component.scss']
})
export class OnboardPopupComponent implements OnInit {

  @Input() userDetails: any;

  @Input() PluginDetails: any;

  constructor(public formService: FormService, public extPluginService: ExtPluginService) { }

  ngOnInit() {
    console.log(this.PluginDetails);
  }

}
