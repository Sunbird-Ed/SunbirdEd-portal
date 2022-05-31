import { features } from "process";

export const mockData = {
  telemetryEventClassic: {
    context: { env: 'main-header', cdata: [] },
    edata: { id: 'switch-theme', type: 'click', pageid: '/explore-course', subtype: 'classic' }
  },
  telemetryEventJoy: {
    context: { env: 'main-header', cdata: [] },
    edata: { id: 'switch-theme', type: 'click', pageid: '/explore-course', subtype: 'joy' }
  },
  homeMenuIntractEdata: {
    id: 'home-tab',
    type: 'click',
    pageid: 'home'
  },
  libraryMenuIntractEdata: {
    id: 'library-tab',
    type: 'click',
    pageid: 'library'
  },
  myLibraryMenuInteractEdata: {
    id: 'myLibrary-tab',
    type: 'click',
    pageid: 'library'
  },
  browseEdata: {
    id: 'browse-tab',
    type: 'click',
    pageid: 'browse'
  },
  helpCenterEdata: {
    id: 'help-center-tab',
    type: 'click',
    pageid: 'help-center'
  },
  learnMenuIntractEdata: {
    id: 'learn-tab',
    type: 'click',
    pageid: 'learn'
  },
  groupsMenuIntractEdata: {
    id: 'groups-tab',
    type: 'click',
    pageid: 'groups'
  },
  workspaceMenuIntractEdata: {
    id: 'workspace-menu-button',
    type: 'click',
    pageid: 'workspace'
  },
  helpMenuIntractEdata: {
    id: 'help-menu-tab',
    type: 'click',
    pageid: 'help'
  },
  contributeMenuEdata: {
    id: 'contribute-tab',
    type: 'click',
    pageid: 'contribute'
  },
  signInIntractEdata: {
    id: ' signin-tab',
    type: 'click',
    pageid: '/resources/view-all/Course-Unit/1'
  },
  LogoutInteractEdata: {
    id: 'logout',
    type: 'click',
    pageid: 'resources'
  },
  featuresObj:[ { id: 'Feature1', type: 'Feature' }, { id: 'Task1', type: 'Task' } ]
}
