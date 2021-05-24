import { Component, OnInit, Input } from '@angular/core';
import { ConfigService,ResourceService } from '@sunbird/shared';

@Component({
    selector: 'submission',
    templateUrl: './submission.component.html',
    styleUrls: ['./submission.component.scss']
})
export class SubmissionsComponent implements OnInit {
    @Input() submissions;
    showPopOver = true;
    
    constructor(
        public resourceService: ResourceService,
    ){}
    ngOnInit(){
        console.log(this.submissions,"submissions");
    }
}