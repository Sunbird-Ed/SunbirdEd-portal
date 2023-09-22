import { Component, Input, OnInit } from '@angular/core';
import { FrameworkService } from '@sunbird/core';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {

  @Input() courseDetails: any;
  @Input() configContent: any;
  associatedTerms = [];

  // levelsInfo = {
  //   header:{
  //     content: 'Content Type',
  //   },
  //   data: []
  // }
  categoryTermsId: any;
  associatedCompetencies:[]
  constructor(private framework: FrameworkService) { }

  ngOnInit(): void {
    this.categoryTermsId = this.courseDetails.se_subjectIds || this.courseDetails.targetTaxonomyCategory4Ids;
    if(this.categoryTermsId){
      this.framework.getSelectedFrameworkCategories(this.courseDetails.targetFWIds[0]).subscribe((res:any) => {
        if(res.result.framework.categories.length>3) {
         this.associatedCompetencies = res.result.framework.categories[3].terms.filter((term:any) => this.categoryTermsId.includes(term.identifier))
        }
      }) 
    }
  }

}
