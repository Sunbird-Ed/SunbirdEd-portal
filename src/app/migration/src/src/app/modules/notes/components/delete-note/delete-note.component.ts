import { NotesService } from '../../services/index';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.css']
})

export class DeleteNoteComponent {

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
   * This variablles is used to cross check the response status code.
   */
  successResponseCode = 'OK';
  /**
   * This variable holds the entire array of existing notes at any point
   * in time.
   */
  notesList: any = [];
  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader = true;
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
    this.route.navigate(['notes']);
  }

  /**
   * This method calls the remove API.
  */
  public removeNote() {
    const requestData = {
      noteId: '/' + this.noteService.selectedNote.id
    };

    this.noteService.remove(requestData).subscribe(
      (response: any) => {

        if (response && response.responseCode === this.successResponseCode) {
          this.notesList = this.notesList.filter(function(note) {
            return note.id !== this.noteService.selectedNote.id;
          });
          this.showLoader = false;
        } else {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0032);
        }
  },
  (err) => {
    this.showLoader = false;
    this.toasterService.error(this.resourceService.messages.fmsg.m0032);
  }
);

}
}
