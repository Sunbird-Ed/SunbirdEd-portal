import { PopupEditorComponent } from './../popup-editor/popup-editor.component';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService } from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INoteData, IdDetails } from '@sunbird/notes';

/**
 * This component holds the note card widget.
 */

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {
  /**
   * This variable holds the content and course id.
   */
  @Input() ids: IdDetails;
  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader = true;
  /**
   * Helps in displaying and hiding create editor.
   */
  showCreateEditor = false;
  /**
   * Helps in displaying and hiding update editor.
   */
  showUpdateEditor = false;

  /**
   * The notesList array holds the entire list of existing notes. Each
   * note is saved as an object.
   */
  notesList: Array<INoteData>;

  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: INoteData;
  /**
   * This variable helps redirecting the user to NotesList view once
   * a note is created or updated.
   */
  route: Router;
  /**
   * Stores the index of the selected note in notesList array.
   */
  selectedIndex: number;
  /**
   * This variable stores the search input from the search bar.
   */
  searchData: string;
  /**
   * user id from user service.
   */
  userId: string;
  /**
   * To display toaster(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * To create or update a note.
   */
  noteService: NotesService;
  /**
   * To retrieve user details.
   */
  userService: UserService;
  /**
   * Reference of content service.
   */
  contentService: ContentService;
  /**
   * Reference of resource service.
   */

  resourceService: ResourceService;
  /**
   * Reference of modal service.
   */

  modalService: SuiModalService;


  /**
   * The constructor
   *
   * @param {ToasterService} toasterService Reference of toasterService.
   * @param {UserService} userService Reference of userService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {SuiModalService} modalService Reference of modalService.
   * @param {NotesService} notesService Reference of notesService.
   */

  constructor(noteService: NotesService,
    userService: UserService,
    contentService: ContentService,
    resourceService: ResourceService,
    modalService: SuiModalService,
    toasterService: ToasterService,
    route: Router) {
    this.toasterService = toasterService;
    this.userService = userService;
    this.route = route;
    this.noteService = noteService;
    this.userService = userService;
    this.contentService = contentService;
    this.resourceService = resourceService;
    this.modalService = modalService;
  }

  /**
   * Initializing notesList and selectedNote values.
   */
  ngOnInit() {
    this.notesList = [];
    /**
     * Initializing notesList array
     */
    this.userId = this.userService.userid;
    this.getAllNotes();
  }

  /**
   * To gather existing list of notes.
   */
  public getAllNotes() {
    const requestBody = {
      request: {
        filter: {
          userid: this.userId,
          courseid: this.ids.courseId,
          contentid: this.ids.courseId
        },
        sort_by: {
          updatedDate: 'desc'
        }
      }
    };

    if (requestBody.request.filter.courseid) {
      if (requestBody.request.filter.contentid) {
        this.noteService.search(requestBody).subscribe(
          (apiResponse: ServerResponse) => {
            this.showLoader = false;
            this.notesList = apiResponse.result.response.note;
            this.selectedNote = this.notesList[0];
          },
          (err) => {
            this.showLoader = false;
            this.toasterService.error(this.resourceService.messages.fmsg.m0033);
          }
        );
      }
    }
  }

  /**
   * This method sets the value of a selected note to the variable 'selectedNote'
   * @param note The selected note from list view.
   * @param a Index of selected note.
   */
  public setSelectedNote(note, a) {
    this.selectedNote = note;
    this.selectedIndex = a;
  }

  createEventEmitter(data) {
    this.notesList.unshift(data);
    this.setSelectedNote(this.notesList[0], 0);
    this.showCreateEditor = false;
  }

  updateEventEmitter(data) {
    this.notesList = this.notesList.filter((note) => {
      return note.id !== data.id;
    });
    this.notesList.unshift(data);
    this.setSelectedNote(this.notesList[0], 0);
    this.showUpdateEditor = false;
  }

  /**
   * This method redirects the user to notesList view.
   */
  public viewAllNotes() {
    this.route.navigate(['viewallnotes']);
  }
}
