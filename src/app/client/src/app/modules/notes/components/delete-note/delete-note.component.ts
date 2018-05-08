import { NotesService } from '../../services';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { INoteData } from '@sunbird/notes';

/**
 * This component helps in deleting a selected note.
 */

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.css']
})

export class DeleteNoteComponent {
  /**
   * This variable is used to hide/display delete pop up.
   */
  @Input() deletePopup: boolean;
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
   * This variable helps redirecting the user to NotesList view once
   * a note is deleted.
   */
  route: Router;
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
  showLoader: boolean;
  /**
   * To display toaster(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * To remove the selected note.
   */
  notesService: NotesService;

  /**
   * Constructor for Delete Note Component
   *
   * @param {ToasterService} toasterService Reference of ToasterService.
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {NotesService} notesService Reference of NotesService.
   * @param {Router} route Reference of Router.
   */

  constructor(route: Router,
    resourceService: ResourceService,
    toasterService: ToasterService,
    notesService: NotesService) {
    this.route = route;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.notesService = notesService;
  }

  /**
   * This method redirects the user from the modal.
  */
  public redirect() {
    this.deletePopup = false;
    this.exitModal.emit(this.deletePopup);
  }

  /**
   * This method calls the remove API.
  */
  public removeNote() {
    const requestData = {
      noteId: this.deleteNote.id
    };

    this.notesService.remove(requestData).subscribe(
      (apiResponse: ServerResponse) => {
        this.showLoader = false;
        this.deleteEventEmitter.emit(this.deleteNote.id);
      },
      (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0032);
      }
    );

  }
}
