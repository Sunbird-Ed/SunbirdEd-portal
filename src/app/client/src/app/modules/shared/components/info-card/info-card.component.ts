import { Component, Input, OnInit } from '@angular/core';
  
interface CardInfo {
    imageUrl: string;
    data: {
      position: string;
      title: string;
      text: string;
    }
  }

@Component({
  selector: 'info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  @Input() cardInfo: CardInfo;
  constructor() { }

  ngOnInit(): void {
  }

}
