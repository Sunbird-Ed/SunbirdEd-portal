import { Injectable } from '@angular/core';
import { ConfigService, SharedModule } from '@sunbird/shared';
import { DataService } from '@sunbird/core';
@Injectable({
  providedIn: 'root'
})
export class SummaryReportsService {

   constructor(
    public config: ConfigService,
    public dataservice: DataService
  ) {}

  /*
  * To get course summary reports
  */
  getCourseSummaryReports(orgId){
    const option = {
      url: this.config.urlConFig.URLS.COURSE.GET_COURSE_SUMMARY_API,
      data: {
        'request': {
          "organisationIds":[orgId]
        }
      }
    };
    this.dataservice.baseUrl="/learner/"
    return this.dataservice.postWithHeaders(option);
   }

    /*
  * To get course summary reports
  */
    getEventSummaryReports(orgId){
      const option = {
        url: this.config.urlConFig.URLS.COURSE.GET_EVENT_SUMMARY_API,
        data: {
          'request': {
            "organisationIds":[orgId]
          }
        }
      };
      this.dataservice.baseUrl="/learner/"
      return this.dataservice.postWithHeaders(option);
     } 
  /*
  * To convert the table data for downloading
  */ 
   downloadFile(data, filename='data') {
    let csvData = this.ConvertToCSV(data, ['CourseName','CourseId', 'BatchName', 'BatchId', 'LessonCount', 'UsersEnrolled', 'UsersCompleted']); 
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

  /*
  * To convert data in csv format
  */
  ConvertToCSV(objArray, headerList)
  {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
        row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i+1)+'';
        for (let index in headerList) {
            let head = headerList[index];

            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
  }
}
