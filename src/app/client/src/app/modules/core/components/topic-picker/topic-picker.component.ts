import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
interface TopicTreeNode {
  id: string;
  name: string;
  selectable: string;
  nodes: Array<TopicTreeNode>;
}
@Component({
  selector: 'app-topic-picker',
  templateUrl: './topic-picker.component.html',
  styleUrls: ['./topic-picker.component.css']
})
export class TopicPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() formTopic: any;

  @Input() selectedTopics: any;

  @Input() topicPickerClass: string;

  @Output() topicChange = new EventEmitter();

  placeHolder: string;

  constructor() {
  }
  ngOnInit() {
    console.log(this.formTopic);
    this.selectedTopics = this.selectedTopics || [];
    this.placeHolder = this.selectedTopics.length + ' topics selected';
  }
  ngAfterViewInit() {
    this.initTopicPicker(this.formatTopics(this.formTopic.range));
  }
  private initTopicPicker(data: Array<TopicTreeNode>) {
    $('.topic-picker-selector').topicTreePicker({
      data: data,
      name: 'Topics',
      picked: _.map(this.selectedTopics, 'identifier'),
      onSubmit: (selectedNodes) => {
        this.selectedTopics = _.map(selectedNodes, node => ({
          identifier: node.id,
          name: node.name
        }));
        this.placeHolder = this.selectedTopics.length + ' topics selected';
        this.topicChange.emit(this.selectedTopics);
      },
      nodeName: 'topicSelector',
      minSearchQueryLength: 1
    });
    setTimeout(() =>
    document.getElementById('topicSelector').classList.add(this.topicPickerClass), 100);
  }
  private formatTopics(topics): Array<TopicTreeNode> {
    return _.map(topics, (topic) => ({
      id: topic.identifier,
      name: topic.name,
      selectable: 'selectable',
      nodes: this.formatTopics(topic.children)
    }));
  }
  ngOnDestroy() {
  }
}
