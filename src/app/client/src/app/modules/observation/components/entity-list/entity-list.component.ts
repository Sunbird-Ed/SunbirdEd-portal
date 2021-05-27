import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
@Component({
    selector: 'entity-list',
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {
    @Input() entities;
    @Input() selectedEntity;
    @Output() onAction = new EventEmitter();
    constructor() { }
    ngOnInit() { }


    action(entity, type) {
        this.onAction.emit({ action: type, data: entity });
    }
}