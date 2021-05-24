import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
@Component({
    selector: 'entity-list',
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {
    @Input() entities;
    @Input() selectedEntity;
    @Output() onDelete = new EventEmitter();
    @Output() onSelect = new EventEmitter();
    constructor() { }
    ngOnInit() { }

    delete(entity) {
        this.onDelete.emit(entity);
    }
    changeEntity(entity) {
        this.onSelect.emit(entity);
    }
}