import { ResourceService } from '@sunbird/shared';
import { ProgramsService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit {

  public programsList$;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService, private router: Router) { }

  ngOnInit() {
    this.programsList$ = this.programsService.programsList$;
  }

}
