import { ResourceService, ToasterService, FilterPipe, ServerResponse } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService } from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { NoteFormComponent } from '../note-form/note-form.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';
import { INotesListData } from '@sunbird/notes';
/**
 * This component contains 2 sub components
 * 1)NoteForm: Provides an editor to create and update notes.
 * 2)DeleteNote: To delete an existing note.
 */

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  entryComponents: [NoteFormComponent]
})
export class NoteListComponent implements OnInit {

  /**
   * This variable helps in displaying and hiding page loader.
   * By default it is assigned a value of 'true'. This ensures that
   * the page loader is displayed the first time the page is loaded.
   */
  showLoader = true;

  /**
   * The 'sortBy' variable helps in making sure that the array of notes
   * retrieved while making the search API call is sorted in descending order.
   */
  sortBy = 'desc';

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
   * The constructor
   *
   * @param {ToasterService} iziToast Reference of toasterService.
   * @param {UserService} userService Reference of userService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {SuiModalService} modalService Reference of modalService.
   * @param {NotesService} notesService Reference of notesService.
   */

  constructor(public noteService: NotesService,
    public userService: UserService,
    public contentService: ContentService,
    public resourceService: ResourceService,
    public modalService: SuiModalService,
    activatedRoute: ActivatedRoute,
    toasterService: ToasterService) {
    this.toasterService = toasterService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
  }

  ngOnInit() {
    this.notesList = [];
    this.showDelete = false;

    /**
     * Initializing selectedNote
    */
    this.noteService.updateNotesListData.subscribe(data => {
      if (data === 0) {
        this.selectedIndex = 0;
        this.notesList = this.notesList.filter((note) => {
          return note.id !== this.selectedNote.id;
        });
        this.notesList.unshift(this.noteService.selectedNote);
        this.selectedNote = this.noteService.selectedNote;
      } else {
      this.notesList.unshift(data);
      this.showNoteList(this.notesList[0], 0);
      }
    });
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
   * This method calls the search API.
   * @param request contains request body.
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
   */
  public showNoteList(note, index) {
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
  finalNotesListData(noteId) {
    this.notesList = this.notesList.filter((note) => {
      return note.id !== noteId;
    });
    if (this.selectedIndex === 0) {
      this.showNoteList(this.notesList[0], 0);
    } else {
      this.showNoteList(this.notesList[this.selectedIndex - 1], this.selectedIndex - 1);
    }
  }
}
