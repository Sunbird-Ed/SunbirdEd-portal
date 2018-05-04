import { ResourceService, ToasterService, FilterPipe, ServerResponse, RouterNavigationService } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService } from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
// import { NoteFormComponent } from '../note-form/note-form.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INoteData, ICourseDetails } from '@sunbird/notes';
/**
 * This component contains 2 sub components
 * 1)NoteForm: Provides an editor to create and update notes.
 * 2)DeleteNote: To delete an existing note.
 */

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
  // entryComponents: [NoteFormComponent]
})
export class NoteListComponent implements OnInit {

  @Input() courseDetails: ICourseDetails;
  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader = true;

  /**
   * The 'sortOrder' variable helps in making sure that the array of notes
   * retrieved while making the search API call is sorted in descending order.
   */
  sortOrder = 'desc';

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
   * The course id of the selected course.
   */
  courseId: string;
  /**
   * The content id of the selected course.
   */
  contentId: string;
  /**
   * This variable helps in displaying and dismissing the delete modal.
   */
  showDelete: false;
  /**
   * User id from user service.
   */
  userId: string;
  /**
   * To get course and note params.
   */
  private activatedRoute: ActivatedRoute;
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
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute.
   * @param {RouterNavigationService} routerNavigationService Reference of RouterNavigationService.
   * @param {Router} route Reference of Router.
   */

  constructor(noteService: NotesService,
    userService: UserService,
    contentService: ContentService,
    resourceService: ResourceService,
    modalService: SuiModalService,
    activatedRoute: ActivatedRoute,
    toasterService: ToasterService,
    route: Router,
    routerNavigationService: RouterNavigationService) {
    this.toasterService = toasterService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.noteService = noteService;
    this.contentService = contentService;
    this.resourceService = resourceService;
    this.modalService = modalService;
    this.route = route;
    this.routerNavigationService = routerNavigationService;
  }
  /**
   * To initialize notesList and showDelete.
   * Listens to updateNotesListData event as well.
   */
  ngOnInit() {

    this.showDelete = false;

    /**
     * Initializing selectedNote
    */
    this.noteService.createEventEmitter.subscribe(data => {
      this.notesList.unshift(data);
      this.setSelectedNote(this.notesList[0], 0);
    });
    this.noteService.updateEventEmitter.subscribe(data => {
      this.selectedIndex = 0;
      this.notesList = this.notesList.filter((note) => {
        return note.id !== this.selectedNote.id;
      });
      this.notesList.unshift(this.noteService.selectedNote);
      this.selectedNote = this.noteService.selectedNote;
    });

    if (this.courseDetails && this.courseDetails.courseId) {
      this.courseId = this.courseDetails.courseId;
    }
    if (this.courseDetails && this.courseDetails.contentId) {
      this.contentId = this.courseDetails.contentId;
    }
    if (!this.courseId && !this.contentId) {
      this.activatedRoute.params.subscribe((params) => {
        this.courseId = params.courseId;
        this.contentId = params.contentId;
      });
    }
    /**
    * Initializing notesList array
    */
    this.userId = this.userService.userid;
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
          updatedDate: this.sortOrder
        }
      }
    };

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
   * This event listener recieves the receives showDeleteModal value once the
   * delete modal is dismissed.
   */
  exitModal(showDeleteModal) {
    this.showDelete = showDeleteModal;
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
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
  }
}
