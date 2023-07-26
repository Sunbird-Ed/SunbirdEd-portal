import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

// const infoData = {
//     title:'Empowering Government Success through Goal-Oriented HR',
//     cardsData: [
//       {
//         imageUrl:'/assets/images/info-card_1.jpg',
//         data:{
//           position: 'right',
//           title:'HR Drives Government Goal Achievement',
//           text:'Aligned HR practices with government goals motivate and engage employees, resulting in improved performance. For quality education, HR hires qualified teachers, provides professional development, and fosters positive work environments.'
//         }
//       },
//       {
//         imageUrl:'/assets/images/info-card_2.jpg',
//         data:{
//           position: 'left',
//           title:'HR Supports Employee Goal Achievement',
//           text:'Clear goals and understanding of their contribution to government objectives boost job satisfaction and achievement. For instance, HR practices can align with employees\' goal to help people in need through volunteering or donation opportunities to charities.'
//         }
//       }
//     ]
//   }

@Component({
  selector: 'info-card-container',
  templateUrl: './info-card-container.component.html',
  styleUrls: ['./info-card-container.component.scss']
})
export class InfoCardContainerComponent implements OnInit {
  @Input() cardInfo:any = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

}
