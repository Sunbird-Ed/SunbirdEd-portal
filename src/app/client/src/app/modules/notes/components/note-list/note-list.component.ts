import { ResourceService, ToasterService, FilterPipe, ServerResponse, RouterNavigationService } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService } from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { InlineEditorComponent } from '../inline-editor/inline-editor.component';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INoteData, IdDetails } from '@sunbird/notes';
/**
 * This component contains 2 sub components
 * 1)Inline editor: Provides an editor to create and update notes.
 * 2)DeleteNote: To delete an existing note.
 */

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
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
  notesList: Array<INoteData> = [];

  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: INoteData;
  /**
   * Stores the index of the selected note in notesList array.
   */
  selectedIndex = 0;
  /**
   * This variable stores the search input from the search bar.
   */
  searchData: string;
  /**
   * This variable helps in displaying and dismissing the delete modal.
   */
  showDelete = false;
  /**
   * User id from user service.
   */
  userId: string;
  /**
   * course id details
   */
  courseId: string;
  /**
   * content id details
   */
  contentId: string;
  /**
   * To display toast message(if any) after each API call.
   */
  private toasterService: ToasterService;
  /**
   * Reference of notes service.
   */
  noteService: NotesService;
  /**
   * Reference of user service.
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
   * Reference of Router.
   */
  route: Router;
  /**
   * Reference of ActivatedRoute.
   */
  activatedRoute: ActivatedRoute;
  /**
   * Reference of Router Navigation Service
   */
  routerNavigationService: RouterNavigationService;
  /**
   * The constructor - Constructor for Note List Component.
   *
   * @param {ToasterService} toasterService Reference of ToasterService.
   * @param {UserService} userService Reference of UserService.
   * @param {ContentService} contentService Reference of ContentService.
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {SuiModalService} modalService Reference of SuiModalService.
   * @param {NotesService} noteService Reference of NotesService.
   * @param {Router} route Reference of Router.
   * @param {ActivatedRouter} activatedRoute Reference of ActivatedRouter.
   */

  constructor(noteService: NotesService,
    userService: UserService,
    contentService: ContentService,
    resourceService: ResourceService,
    modalService: SuiModalService,
    toasterService: ToasterService,
    route: Router,
    activatedRoute: ActivatedRoute) {
    this.toasterService = toasterService;
    this.userService = userService;
    this.noteService = noteService;
    this.contentService = contentService;
    this.resourceService = resourceService;
    this.modalService = modalService;
    this.route = route;
    this.activatedRoute = activatedRoute;
  }
  /**
   * To initialize notesList and showDelete.
   * Listens to updateNotesListData event as well.
   */
  ngOnInit() {
    /**
     * Initializing notesList array
     */
    this.userId = this.userService.userid;
    this.activatedRoute.params.subscribe(params => {
      this.contentId = params.contentId;
      this.courseId = params.courseId;
    });
    this.getAllNotes();
  }

  /**
   * This method calls the search API.
   */
  public getAllNotes() {
    const requestBody = {
      request: {
        filter: {
          userid: this.userId,
          courseid: this.courseId,
          contentid: this.contentId
        },
        sort_by: {
          updatedDate: 'desc'
        }
      }
    };

    if (requestBody.request.filter.contentid || requestBody.request.filter.courseid) {
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

  /**
   * This method sets the value of a selected note to the variable 'selectedNote'
   * and passes it on to notesService.
   * @param note The selected note from list view.
   * @param index The index of the selectedNote.
   */
  public setSelectedNote(note, index) {
    this.selectedIndex = index;
    this.selectedNote = note;
  }

  /**
   * Updating notes list after creating/updating a note.
   */
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
   * This event listener updates the notesList array once a note is removed.
   */
  deleteEventEmitter(noteId) {
    this.notesList = this.notesList.filter((note) => {
      return note.id !== noteId;
    });
    if (this.selectedIndex === 0) {
      this.setSelectedNote(this.notesList[0], 0);
    } else {
      this.setSelectedNote(this.notesList[this.selectedIndex - 1], this.selectedIndex - 1);
    }
  }

  /**
   * This method helps in redirecting the user to parent url.
   */
  public redirect() {
    this.route.navigate(['/resources/play/content/', this.contentId]);
  }
}
