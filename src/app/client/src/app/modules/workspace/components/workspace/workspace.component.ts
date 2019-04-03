import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
