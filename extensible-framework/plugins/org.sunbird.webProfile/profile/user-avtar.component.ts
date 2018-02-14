import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-user-avtar',
  templateUrl: './user-avtar.component.html',
  styleUrls: ['./user-avtar.component.css']
})
export class UserAvtarComponent implements OnInit {
  @Input() avator: any
  constructor() { }

  ngOnInit() {
  }

}
