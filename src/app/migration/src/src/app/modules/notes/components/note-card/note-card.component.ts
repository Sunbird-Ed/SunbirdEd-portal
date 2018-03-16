import { ResourceService, ToasterService } from '@sunbird/shared';
import { NotesService } from '../../services/index';
import { UserService, ContentService} from '@sunbird/core';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { NoteFormComponent } from '../note-form/note-form.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { SuiModal, ComponentModalConfig, ModalSize, SuiModalService } from 'ng2-semantic-ui';


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
  notesList: any = [];

  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: any = {};
  /**
   * Stores the index of the selected note in notesList array.
   */
  selectedIndex: number;
  /**
   * This variable stores the search input from the search bar.
   */
  searchData: string;
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
      this.activatedRoute = this.activatedRoute;
    }
  ngOnInit() {

    this.getAllNotes();
    const selectedNote = this.selectedNote;
    this.noteService.updateNotesListData.subscribe(data => this.notesList.push(data));
  }

  public searchNote(request) {

    const requestBody = request;

    this.noteService.search(requestBody).subscribe(
      (note) => {
        if (note && note.responseCode === this.successResponseCode) {
          this.showLoader = false;
          this.notesList = note.result.response.note;
          this.selectedNote = this.notesList[0];
        } else {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0033);
        }
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
  public showNoteList(note, a) {
    this.selectedNote = note;
    this.noteService.selectedNote = this.selectedNote;
    console.log(a);
  }

  /**
   * This method creates the request body for the search API call.
  */
  public getAllNotes() {
    const requestData = {
      request: {
      filter: {
        userid: this.userService.userid,
        courseid: 'do_2123229899264573441612'
      },
      sort_by: {
        updatedDate: this.sortBy
      }
    }
  };
    this.searchNote(requestData);
  }



}
