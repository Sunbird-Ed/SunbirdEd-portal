import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-goal-oriented-hr-card',
  inputs: ['data'],
  templateUrl: './goal-oriented-hr-card.component.html',
  styleUrls: ['./goal-oriented-hr-card.component.scss']
})

export class GoalOrientedHrCardComponent implements OnInit {

  @Input() data: object; // decorate the property with @Input()

  constructor() { }

  ngOnInit(): void {
  }

}
