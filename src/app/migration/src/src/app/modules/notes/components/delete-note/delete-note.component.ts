import { NotesService } from '../../services';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { INotesListData } from '@sunbird/notes';

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
  @Input() showDeleteNoteList: boolean;
  /**
   * This variable contains the details of the note to be deleted.
   */
  @Input() DeleteNote: INotesListData;
  /**
   * An event emitter that emits the delete-popup status.
   */
  @Output() exitModal = new EventEmitter<boolean>();
  /**
   * An event emiiter to update the notesList.
   */
  @Output() finalNotesListData = new EventEmitter<string>();


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
  notesList: INotesListData;
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
  noteService: NotesService;

  /**
   * The constructor
   *
   * @param {ToasterService} toasterService Reference of toasterService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {NotesService} noteService Reference of notesService.
   * @param {Router} route Reference of route.
   */

  constructor(route: Router,
    resourceService: ResourceService,
    toasterService: ToasterService,
    noteService: NotesService) {
    this.route = route;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.noteService = noteService;
   }

  /**
   * This method redirects the user from the editor.
  */
  public redirect() {
    this.showDeleteNoteList = false;
    this.exitModal.emit(this.showDeleteNoteList);
  }

  /**
   * This method calls the remove API.
  */
  public removeNote() {
    const requestData = {
    noteId: this.DeleteNote.id
    };

    this.noteService.remove(requestData).subscribe(
      (apiResponse: ServerResponse) => {
          this.showLoader = false;
          this.finalNotesListData.emit(this.DeleteNote.id);
  },
  (err) => {
    this.showLoader = false;
    this.toasterService.error(this.resourceService.messages.fmsg.m0032);
  }
);

}
}
