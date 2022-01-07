
import { Component, OnInit, Input } from '@angular/core';
import { SummaryReportsService } from '../../services';
import { UserService } from '@sunbird/core';
import * as _ from 'lodash-es';

/**
 * The EventSummary component
 *
 * Display Event-Summary-Reports
 */
@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})

/**
 * @class EventSummaryComponent
*/
export class EventSummaryComponent implements OnInit{ 

  /**
   * To get logged-in user profile
   */
  userService: UserService;

  /**
   * Default method of EventSummaryCoursesService class
   *
   * @param {EventSummaryCoursesService} eventSummaryCourses To get language constant
   */
  constructor(userService: UserService, public eventSummaryCourses: SummaryReportsService) {
    this.userService = userService;
  }

  eventBatchesData:any;
  arrrayCourseReports : any =[];
  @Input() paginateLimit: number = 5;
  p: any;

  // Bar chart
  barChartLabels:any;
  barChartType = 'bar';
  barChartLegend :boolean= true;
  barChartData:any;
  public barChartOptions:any;
  orgIds : any;

  // pie chart
  pieChartOptions : any;
  pieChartLabels :any;
  pieChartData : any;
  pieChartType = 'pie';
  pieChartLegend : boolean= true;
  pieChartPlugins = [];

  ngOnInit()
  {
    this.eventSummaryCourses.getEventSummaryReports(this.userService._rootOrgId).subscribe((res) => {
      if (res.responseCode == "OK") 
      {
        this.eventBatchesData = res.result.content;
        var courseBatchesIds: string[] = [];
        var totalCourseEnrolled: string[] = [];
        var totalCourseCompleted: string[] = [];
        var totalCompleted = 0;
        var totalEnrolled = 0;
        var totalIncompleted = 0;
        this.eventBatchesData.forEach(function (value) {

        if(value.batchId || value.totalCompleted)
        {
          courseBatchesIds.push(value.batchName);
          totalCourseEnrolled.push(value.totalEnrolled);
          totalCourseCompleted.push(value.totalCompleted);

          totalCompleted=totalCompleted + value.totalCompleted;
          totalEnrolled=totalEnrolled + value.totalEnrolled;         
        }
        });

        totalIncompleted = totalEnrolled - totalCompleted;
        this.createBarGraph(courseBatchesIds,totalCourseEnrolled,totalCourseCompleted);
        this.createPieChart(totalIncompleted,totalCompleted);
      }
    },(err) => {
      console.log({ err });
    });
  }

  createBarGraph(courseBatcheIds,totalCourseEnrolled,totalCourseCompleted)
  {
     this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        yAxes: [{
           scaleLabel: {
              display: true,
              labelString: 'Total Enrollled and Total Completed Events'
           }
        }],
        xAxes: [{
          scaleLabel: {
             display: true,
             labelString: 'Batch Name'
          }
       }]
     },
     title: {
      text: 'Event wise Completion',
      display: true
    }
    };
    this.barChartLabels = courseBatcheIds;
    this.barChartType = 'bar';
    this.barChartLegend = true;

    this.barChartData = [
      {data: totalCourseEnrolled, label: 'Total Enrolled'},
      {data: totalCourseCompleted, label: 'Total Completed'}
    ];
  }

  createPieChart(totalIncompleted,totalCompleted)
  {
    this.pieChartOptions = {
      responsive: true,
      title: {
        text: 'Event Completion Summary',
        display: true
      }
    };
    this.pieChartLabels = ['Total Completed', 'Total Incomplete'];
    this.pieChartData = [totalIncompleted, totalCompleted];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }

  getCourseReportsDataCsv()
  {
    this.eventBatchesData.forEach(item => {
      var EventReportsData: any = [];
      EventReportsData.CourseName = item.name;
      EventReportsData.CourseID = item.identifier;
      EventReportsData.BatchName = item.batchName;
      EventReportsData.BatchId = item.batchId;
      EventReportsData.LessonCount = '0';
      EventReportsData.UsersEnrolled = item.totalEnrolled;
      EventReportsData.UsersCompleted = item.totalCompleted;

      this.arrrayCourseReports.push(EventReportsData);      
    });

    this.eventSummaryCourses.downloadFile(this.arrrayCourseReports, 'course-report');
  }
}
