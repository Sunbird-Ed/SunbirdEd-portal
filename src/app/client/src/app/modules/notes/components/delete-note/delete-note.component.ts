
import {takeUntil} from 'rxjs/operators';
import { ILoaderMessage } from './../../../shared/interfaces/loader';
import { NotesService } from '../../services';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { INoteData } from '@sunbird/notes';

import { Subject } from 'rxjs';

/**
 * This component helps in deleting a selected note.
 */

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.css']
})

export class DeleteNoteComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal;
  /**
   * This variable contains the details of the note to be deleted.
   */
  @Input() deleteNote: INoteData;
  /**
   * An event emitter that emits the delete-popup status.
   * Thereby assists in exiting the delete modal.
   */
  @Output() exitModal = new EventEmitter<boolean>();
  /**
   * An event emitter to update the notesList array.
   */
  @Output() deleteEventEmitter = new EventEmitter<string>();
  /**
   * To call the resource service.
   */
  resourceService: ResourceService;
  /**
   * This variable holds the entire array of existing notes at any point
   * in time.
   */
  notesList: INoteData;
  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader = false;
  /**
   * To display toaster(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * To remove the selected note.
   */
  notesService: NotesService;

  public unsubscribe$ = new Subject<void>();

  public loaderMessage: ILoaderMessage;

  /**
   * Constructor for Delete Note Component
   *
   * @param {ToasterService} toasterService Reference of ToasterService.
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {NotesService} notesService Reference of NotesService.
   */

  constructor(
    resourceService: ResourceService,
    toasterService: ToasterService,
    notesService: NotesService) {
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.notesService = notesService;
  }

  ngOnInit() {
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0116
    };
  }

  /**
   * This method redirects the user from the modal.
  */
  public redirect() {
    this.exitModal.emit();
  }

  /**
   * This method calls the remove API.
  */
  public removeNote() {
    this.showLoader = true;

    const requestData = {
      noteId: this.deleteNote.id
    };

    this.notesService.remove(requestData).pipe(
    takeUntil(this.unsubscribe$))
    .subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.deleteEventEmitter.emit(this.deleteNote.id);
        this.modal.approve();
      },
      (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0032);
        this.modal.approve();
      }
    );

  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
