import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {INoResultMessage} from '../../interfaces/noresult';
import { ResourceService } from '../../services/index';
import { Subscription, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';



/**
 * No Result component
 */
@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent implements OnInit, OnDestroy {
  /**
   * input for NoResultMessage
  */
  @Input() data: INoResultMessage;
  /**
   * no result message
  */
  message: string;

  resourceDataSubscription: Subscription;
  /**
   * no result messageText for component
  */
  messageText: string;
  public unsubscribe$ = new Subject<void>();

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.setMessage();
    this.resourceDataSubscription = this.resourceService.languageSelected$
    .pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.setMessage();
    }, err => {
    });
  }

  setMessage() {
    this.message = _.has(this.data, 'message') ? (_.get(this.resourceService, this.data.message) ||
    _.get(this.resourceService, 'messages.stmsg.m0007')) : '';

    this.messageText = _.has(this.data, 'messageText') ? (_.get(this.resourceService, this.data.messageText) ||
      _.get(this.resourceService, 'messages.stmsg.m0006')) : '';
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
}
