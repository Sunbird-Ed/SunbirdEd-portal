import { ActivatedRoute } from '@angular/router';
import { CsModule } from '@project-sunbird/client-services';
import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import * as _ from 'lodash-es';
import { GroupsService } from '../../services';

@Component({
  selector: 'app-group-workspace',
  templateUrl: './group-workspace.component.html',
  styleUrls: ['./group-workspace.component.scss']
})
export class GroupWorkspaceComponent implements OnInit {
  private groupId: string;
  public groupData: {};
  public noMember = false;
  public noCourse = false;
  public noResultMsg: string;
  public memberQuery;
  public courseQuery;
  public showMenu = false;
  public showModal = false;
  public modalName: string;
  public selectedMember;
  private _membersList = [
    {identifier: '1', initial: 'S', title: 'Swetha', isAdmin: true, indexOfMember: 1 },
    {identifier: '2', initial: 'R', title: 'Rhea', isAdmin: true, isMenu: true, indexOfMember: 3 },
    {identifier: '3', initial: 'A', title: 'Aishwarya',  isAdmin: true, isMenu: true, indexOfMember: 4 },
    {identifier: '4', initial: 'C', title: 'Cham', isMenu: true, indexOfMember: 5 },
    {identifier: '5', initial: 'R', title: 'Ritu', isMenu: true, indexOfMember: 6},
    {identifier: '6', initial: 'K', title: 'Kirthan', isMenu: true, indexOfMember: 7}
  ];
  public membersList = [];
  pastMembersList = [
    {identifier: '7', initial: 'A', title: 'Abhinav', isMenu: true, indexOfMember: 1 },
    {identifier: '8', initial: 'R', title: 'Rishi', isMenu: true, indexOfMember: 2},
    {identifier: '9', initial: 'K', title: 'Kavitha', isMenu: true, indexOfMember: 3},
  ];
  public groupsList = [
    {
      'identifier': 'do_1130152710033489921159',
      'name': 'Class 5B',
      'description': 'Class 5B - CBSE - English - Math',
      'objectType': 'Class',
      'status': 'Live',
      'versionKey': '1588778384610',
      'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
      'framework': 'tpd',
      'board': 'CBSE',
      'subject': [
        'Math'
      ],
      'gradeLevel': [
        'Grade 5'
      ],
      'medium': [
        'English'
      ],
      'createdOn': '2020-05-06T15:16:38.655+0000',
      'lastUpdatedOn': '2020-05-06T15:19:44.610+0000',
      'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8'
    },
    {
      'identifier': 'do_1130152710033489921153',
      'name': 'Class 6',
      'description': 'Class 5B - CBSE - English - Math',
      'objectType': 'Class',
      'status': 'Live',
      'versionKey': '1588778384610',
      'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
      'framework': 'tpd',
      'board': 'CBSE',
      'subject': [
        'Math'
      ],
      'gradeLevel': [
        'Grade 5'
      ],
      'medium': [
        'English'
      ],
      'createdOn': '2020-05-06T15:16:38.655+0000',
      'lastUpdatedOn': '2020-05-06T15:19:44.610+0000',
      'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8'
    }
  ];
  _courseList = [];
  courseList = [];

  constructor(private activatedRoute: ActivatedRoute, private renderer: Renderer2, private groupService: GroupsService) {
     this.groupService = groupService;
  }

  ngOnInit() {
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.membersList = this._membersList;
    this.groupData = _.find(this.groupsList, {identifier: this.groupId});
    // this.groupById();
  }

  // groupById() {
  //   console.log(this.activatedRoute.snapshot);
  //   this.groupService.getById(this.groupId).subscribe(groupData => {
  //       this.groupData = groupData;
  //   }, err => {
  //       this.groupData = _.find(this.groupsList, {identifier: this.groupId});
  //   });
  // }

  searchMembers() {
    const data = _.map(this._membersList, (member) => {
        if (_.includes(_.lowerCase(member.title), _.lowerCase(this.memberQuery))) {
          return member;
        }
    });
    this.membersList = _.compact(data);
    this.noMember = _.isEmpty(this.membersList);
    this.noResultMsg = this.noMember ? 'No member found' : '';
  }

  clearMemberSearch() {
    this.membersList = this._membersList;
    this.memberQuery = '';
    this.noMember = false;
  }

  searchCourses(event) {
  console.log('event', event);
  // const data = _.map(this._courseList, (course) => {
  //     if (_.includes(_.lowerCase(course.name), _.lowerCase(this.courseQuery))) {
  //       return course;
  //     }
  // });
  // this.courseList = _.compact(data);
  // this.noCourse = _.isEmpty(this.courseList);
  // this.noResultMsg = this.noCourse ? 'No course available' : '';
  }

  clearCourseSearch() {
    this.courseQuery = '';
    this.noCourse = false;
  }

  getMenuData(event) {
    this.selectedMember = _.find(this.membersList, {identifier: _.get(event, 'data.identifier')});
    this.showMenu = _.isEqual(_.get(this.selectedMember, 'identifier'), _.get(event, 'data.identifier'));
  }

  openModal(event, name) {
    this.showModal = true;
    this.modalName = name;
  }

  closeModal() {
    this.showModal = false;
  }

  handleMember(event) {
    this.showMenu = false;
    if (event.modalName === 'Remove') {
      const data = _.map(this.membersList, member => {
        if (member.identifier !== event.data.identifier) {
          return member;
        } else {
          this.pastMembersList.push(member);
        }
      });
      this.membersList = _.compact(data);
    } else if (event.modalName === 'Dismiss') {
      _.map(this.membersList, member => {
        if (member.identifier === event.data.identifier) {
          member.isAdmin = false;
        }
      });
    } else if (event.modalName === 'Promote') {
      _.map(this.membersList, member => {
        if (member.identifier === event.data.identifier) {
          member.isAdmin = true;
        }
      });
    }
  }
}
