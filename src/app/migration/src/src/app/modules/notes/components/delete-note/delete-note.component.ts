import { NotesService } from '../../services/index';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { INotesListData } from '@sunbird/notes';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.css']
})

export class DeleteNoteComponent {

  @Input() showDeleteNoteList: boolean;
  @Input() DeleteNote: INotesListData;
  @Output() exitModal = new EventEmitter<boolean>();
  @Output() finalNotesListData = new EventEmitter<string>();


  /**
   * This variable helps redirecting the user to NotesList view once
   * a note is created or updated.
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
   * The constructor
   *
   * @param {ToasterService} iziToast Reference of toasterService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {NotesService} notesService Reference of notesService.
   */

  constructor(route: Router,
    resourceService: ResourceService,
    toasterService: ToasterService,
    public noteService: NotesService) {
    this.route = route;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
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
