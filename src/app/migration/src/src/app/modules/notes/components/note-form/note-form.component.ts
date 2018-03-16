import { NotesService } from '../../services/index';
import { UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
// import * as Markdown from 'pagedown-core/node-pagedown.js';
// import 'pagedown-core/Markdown.Editor.js';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})

export class NoteFormComponent implements OnInit, AfterViewInit {
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
   * To bind the user input and modal.
   */
  noteData: any = {};
  /**
   * This variable holds the entire array of existing notes at any point
   * in time.
   */
  notesList: any = [];
  /**
   * This variablles is used to cross check the response status code.
   */
  successResponseCode = 'OK';
  /**
   * This variable helps in passing the 'mode' details to the note form.
   * The mode can be either 'create' or 'update'. The note form updates it's
   * buttons with respect to the 'mode' value.
   */
  mode: string;
  /**
   * To get course and note params.
   */
  private activatedRoute: ActivatedRoute;
  /**
   *Stores the details of a note selected by the user.
   */
  selectedNote: any = {};
  /**
   * The course id of the selected course.
   */
  courseId: string;

  /**
   * The content id of the selected content.
   */
  contentId: string;

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

  // private Markdown: any;

  /**
   * The constructor
   *
   * @param {ToasterService} iziToast Reference of toasterService.
   * @param {UserService} userService Reference of userService.
   * @param {ContentService} contentService Reference of contentService.
   * @param {ResourceService} resourceService Reference of resourceService.
   * @param {NotesService} notesService Reference of notesService.
   * @param {ActivatedRoute} activatedRoute Reference of activatedRoute.
   */

  constructor(route: Router,
    resourceService: ResourceService,
    public userService: UserService,
    public noteService: NotesService,
    activatedRoute: ActivatedRoute,
    toasterService: ToasterService) {
    this.route = route;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.activatedRoute = activatedRoute;
    this.activatedRoute.params.subscribe((params) => {
    this.mode = params.mode;
    });
  }

  private router: Router;

  ngOnInit() {
    this.selectedNote = this.noteService.selectedNote;
    this.activatedRoute.parent.params.subscribe((params) => {
      this.courseId = params.courseId;
      this.contentId = params.contentId;
    });
  }

  ngAfterViewInit() {
    const converter1 = Markdown.getSanitizingConverter();
    converter1.hooks.chain('preBlockGamut', function (text, rbg) {
      return text.replace(/^ {0,3}""" *\n((?:.*?\n)+?) {0,3}""" *$/gm, function (whole, inner) {
        return '<blockquote>' + rbg(inner) + '</blockquote>\n';
      });
    });
    const editor1 = new Markdown.Editor(converter1);

    editor1.run();


  }

  /**
   * This method redirects the user from the editor.
  */
  public redirect() {
    this.route.navigate(['notes']);
  }

  /**
   * This method resets the note "Title" and "Description" when "CLEAR" button
   * is clicked.
  */
  public clearNote() {
    this.noteData.title = '';
    this.noteData.note = '';
  }

  /**
   * This method calls the create API.
  */
  public createNote() {
    const requestData = {
      request: {
        note: this.noteData.note,
        userId: this.userService.userid,
        title: this.noteData.title,
        courseId: this.courseId,
        contentId: this.contentId,
        createdBy: this.userService.userid,
        updatedBy: this.userService.userid,
        createdDate: {},
        updatedDate: {},
        id: {}
      }
    };
    this.noteService.create(requestData).subscribe(
      (response: any ) => {
        if (response && response.responseCode === this.successResponseCode) {
        this.showLoader = false;
      } else {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0030);
      }
    },
    (err) => {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0030);
    }
    );
  }

  /**
   * This method calls the update API.
   */
  public updateNote() {
    this.selectedNote.updatedDate = new Date().toISOString();
    const requestData = {
      noteId: '/' + this.noteService.selectedNote.id,
      request: {
        note: this.selectedNote.note,
        title: this.selectedNote.title,
        updatedBy: this.noteService.selectedNote.userId,
        updatedDate: this.selectedNote.updatedDate
      }
    };
    this.noteService.update(requestData).subscribe(
      (response) => {

        if (response && response.responseCode === this.successResponseCode) {
          this.showLoader = false;
        } else {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0034);
        }
      },
      (err) => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0034);
      }
    );
  }
}
