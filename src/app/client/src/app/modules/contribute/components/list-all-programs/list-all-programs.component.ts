import { ResourceService } from '@sunbird/shared';
import { IProgramsList, ProgramsService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit {

  public programsList$: Observable<IProgramsList>;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService) { }

  ngOnInit() {
    this.programsList$ = this.programsService.programsList$;
  }

}
