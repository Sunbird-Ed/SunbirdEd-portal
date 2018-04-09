import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService} from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { NoteFormComponent } from '../note-form/note-form.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INotesListData } from '@sunbird/notes';

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
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader: boolean;

  /**
   * The 'sortBy' variable helps in making sure that the array of notes
   * retrieved while making the search API call is sorted in descending order.
   */
  sortBy = 'desc';

  /**
   * This variablles is used to cross check the response status code.
   */
  successResponseCode = 'OK';

  /**
   * The notesList array holds the entire list of existing notes. Each
   * note is saved as an object.
   */
  notesList: Array<INotesListData>;

  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: INotesListData;

  /**
   * The course id of the selected course.
   */
  courseId: string;
  /**
   * The content id of the selected course.
   */
  contentId: string;
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
   * To get course and note params.
   */
  private activatedRoute: ActivatedRoute;
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
    activatedRoute: ActivatedRoute,
    toasterService: ToasterService,
    route: Router) {
      this.toasterService = toasterService;
      this.activatedRoute = activatedRoute;
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
    const selectedNote = this.selectedNote;
    this.noteService.updateNotesListData.subscribe(data => this.notesList.push(data));
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = params.courseId;
      this.contentId = params.contentId;
    });

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
        courseid: this.courseId,
        contentid: this.contentId
      },
      sort_by: {
        updatedDate: this.sortBy
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
   * @param a Index of selected note.
   */
  public showNoteList(note, a) {
    this.selectedNote = note;
    this.noteService.selectedNote = this.selectedNote;
  }

  /**
   * This method redirects the user to notesList view.
   */
  public viewAllNotes() {
    this.route.navigate([this.courseId, this.contentId, 'notes']);
  }



}
