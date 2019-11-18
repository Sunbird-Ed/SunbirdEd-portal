import { Component, OnInit, EventEmitter } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { PageApiService, OrgDetailsService, UserService } from '@sunbird/core';
import {
    ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData,
    BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { takeUntil, map, mergeMap, first, filter, tap } from 'rxjs/operators';

import {
    OfflineFileUploaderService
} from './../../../../../../../../projects/desktop/src/app/modules/offline/services';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

    public showLoader = true;
    public queryParams: any;
    public hashTagId: string;
    public dataDrivenFilters: any = {};
    public slug: string;
    organisationId: string;
    public carouselMasterData: Array<ICaraouselData> = [];
    public pageSections: Array<ICaraouselData> = [];
    public initFilters = false;

    public dataDrivenFilterEvent = new EventEmitter();
    public unsubscribe$ = new Subject<void>();

    /* Hardcoded data */
    defaultImage = 'assets/imgs/default.png';
    contentList = [
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21256975952798515213721-latest",
            "keywords": [
                "dadaf"
            ],
            "subject": "Tamil",
            "channel": "in.ekstep",
            "downloadUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21256975952798515213721/creation-100100_1542778850847_do_21256975952798515213721_2.0.ecar",
            "organisation": [
                "Sachin 2808"
            ],
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21256975952798515213721/creation-100100_1542778851702_do_21256975952798515213721_2.0_spine.ecar",
                    "size": 797118
                }
            },
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124899901836247041294/artifact/0306022-1.jpg_1524657005308.jpg",
            "gradeLevel": [
                "Class 2"
            ],
            "collections": [
                "do_21256985173761228816314",
                "do_2124396034467676161971",
                "do_21256984927485952016311"
            ],
            "appId": "staging.sunbird.portal",
            "artifactUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21256975952798515213721/artifact/1542778847745_do_21256975952798515213721.zip",
            "contentEncoding": "gzip",
            "contentType": "Resource",
            "lastUpdatedBy": "8d28e44c-b295-42be-8417-dd756486ff85",
            "identifier": "do_21256975952798515213721",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "86dd77ad-18d7-4d27-b72c-ba732b4009d3",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "version": 2,
            "prevState": "Processing",
            "lastPublishedOn": "2018-11-21T05:40:48.675+0000",
            "size": 7813097,
            "name": "Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  Creation 100100  ",
            "attributions": [
                "testing"
            ],
            "status": "Live",
            "totalQuestions": 2,
            "orgDetails": {},
            "code": "org.sunbird.WtVkXR",
            "description": "trikjr",
            "medium": "Telugu",
            "streamingUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21256975952798515213721-latest",
            "idealScreenSize": "normal",
            "createdOn": "2018-08-20T06:10:37.421+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-345",
                    "assertionId": "fa2ec612-18da-4048-b146-a8846588a9a5",
                    "badgeClassImage": "https://sunbirdstaging.blob.core.windows.net/badgr/uploads/badges/badf0408727b0c90556b5de31829164e.png",
                    "badgeId": "badgeslug-85",
                    "badgeClassName": "Best guide",
                    "createdTS": 1534759115237,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-11-21T05:40:45.040+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2018-11-21T05:40:51.986+0000",
            "createdFor": [
                "0125683555607347207"
            ],
            "creator": "Sham r",
            "os": [
                "All"
            ],
            "totalScore": 3,
            "pkgVersion": 2,
            "versionKey": "1542778846752",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_21256975952798515213721/creation-100100_1542778850847_do_21256975952798515213721_2.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2018-08-16T04:50:00.554+0000",
            "createdBy": "8d28e44c-b295-42be-8417-dd756486ff85",
            "compatibilityLevel": 2,
            "board": "CBSE",
            "resourceType": "Learn",
            "node_id": 409230
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125047996214067201105/pdf-sample.pdf",
            "keywords": [
                "test"
            ],
            "subject": "Urdu",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125047996214067201105/16may-pdf-upload_1538552344206_do_2125047996214067201105_4.0.ecar",
            "showNotification": true,
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125047996214067201105/16may-pdf-upload_1538552344279_do_2125047996214067201105_4.0_spine.ecar",
                    "size": 13413
                }
            },
            "mimeType": "application/pdf",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2125047996214067201105/artifact/1466505161547apple.thumb.png",
            "gradeLevel": [
                "Class 2"
            ],
            "collections": [
                "do_21257125420203212817093",
                "do_21257827911837286411681",
                "do_21257133955701145617133",
                "do_21257124179043123217073",
                "do_21257142133474918417187",
                "do_21260466111629721611377",
                "do_21257125905047552017102",
                "do_2126138400531742721505",
                "do_21257131794698240017119",
                "do_21257136897708851217164",
                "do_21257144778190028817196",
                "do_21260466236003942411379",
                "do_21257124195636838417074",
                "do_21257135975308492817152",
                "do_21260465839606988811374",
                "do_21257136783278080017162",
                "do_21271796456817459211808",
                "do_2126138352511385601500",
                "do_2127099066970193921930",
                "do_21257131719372800017118",
                "do_21257144699138048017195"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125047996214067201105/pdf-sample.pdf",
            "contentEncoding": "identity",
            "sYS_INTERNAL_LAST_UPDATED_ON": "2018-10-03T07:39:04.363+0000",
            "contentType": "Resource",
            "lastUpdatedBy": "bb335f84-f624-4bdd-9e5e-95c62dc690ff",
            "identifier": "do_2125047996214067201105",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "bb335f84-f624-4bdd-9e5e-95c62dc690ff",
            "languageCode": "en",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "pragma": [
                "external"
            ],
            "prevState": "Live",
            "lastPublishedOn": "2018-10-03T07:39:04.206+0000",
            "size": 17905,
            "concepts": [
                "AI33"
            ],
            "name": "16MAY-PDF Upload",
            "status": "Live",
            "orgDetails": {},
            "code": "be8e0283-d492-4d64-8e44-a00b8e856512",
            "description": "testing by umesh",
            "medium": "Telugu",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125047996214067201105/pdf-sample.pdf",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/1466505161547apple.png",
            "idealScreenSize": "normal",
            "createdOn": "2018-05-16T09:59:57.534+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "236121b8-b2fd-4c62-85a9-5f011433f3e8",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/343f9a93e8c2a82ffe36e9ecfbf363f6.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1545893001107,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-10-03T07:39:03.405+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2018-12-27T06:43:21.205+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "01250469287604224011"
            ],
            "creator": "May creator",
            "os": [
                "All"
            ],
            "pkgVersion": 4,
            "versionKey": "1534575021960",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_2125047996214067201105/16may-pdf-upload_1538552344206_do_2125047996214067201105_4.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2018-05-16T10:01:30.626+0000",
            "createdBy": "9541757e-976e-47ee-b981-2f0f312529b0",
            "compatibilityLevel": 4,
            "attribution": "test",
            "board": "CBSE",
            "resourceType": "Test",
            "node_id": 199891
        },
        {
            "ownershipType": [
                "createdFor"
            ],
            "previewUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21266324379998617614877-latest",
            "subject": "English",
            "channel": "in.ekstep",
            "questions": [
                "do_21266327656724070415486"
            ],
            "downloadUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21266324379998617614877/r05_test_1545810351946_do_21266324379998617614877_1.0.ecar",
            "organisation": [
                "Sachin 2808"
            ],
            "language": [
                "English"
            ],
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "variants": {
                "spine": {
                    "ecarUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21266324379998617614877/r05_test_1545810352220_do_21266324379998617614877_1.0_spine.ecar",
                    "size": 29291
                }
            },
            "editorState": "{\"plugin\":{\"noOfExtPlugins\":14,\"extPlugins\":[{\"plugin\":\"org.ekstep.contenteditorfunctions\",\"version\":\"1.2\"},{\"plugin\":\"org.ekstep.keyboardshortcuts\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.richtext\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.iterator\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.navigation\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.mathtext\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.libs.ckeditor\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.keyboard\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.1\"},{\"plugin\":\"org.ekstep.questionunit.mtf\",\"version\":\"1.1\"},{\"plugin\":\"org.ekstep.questionunit.reorder\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.sequence\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.ftb\",\"version\":\"1.0\"}]},\"stage\":{\"noOfStages\":7,\"currentStage\":\"bb41b09e-151d-4194-aa6e-54132bd73ee3\",\"selectedPluginObject\":\"65131bc5-6092-4116-b648-231c8a1846ad\"},\"sidebar\":{\"selectedMenu\":\"settings\"}}",
            "objectType": "Content",
            "gradeLevel": [
                "Class 5"
            ],
            "appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21266324379998617614877/artifact/icon_1545638427515.thumb.png",
            "collections": [
                "do_21266328015857254415496",
                "do_21266330591811993615858",
                "do_21266330034026086415838",
                "do_21266328823947264015798",
                "do_21266327990500556815494"
            ],
            "appId": "staging.diksha.portal",
            "contentEncoding": "gzip",
            "artifactUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21266324379998617614877/artifact/1545810351578_do_21266324379998617614877.zip",
            "lockKey": "cbde56e1-5337-41bf-81c9-f155a29ece3e",
            "contentType": "Resource",
            "identifier": "do_21266324379998617614877",
            "lastUpdatedBy": "d32e170d-010b-4bc5-ae55-3ac5e547e35b",
            "audience": [
                "Instructor"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "lastPublishedBy": "86dd77ad-18d7-4d27-b72c-ba732b4009d3",
            "version": 2,
            "pragma": [
                "external"
            ],
            "prevState": "Review",
            "size": 1725857,
            "lastPublishedOn": "2018-12-26T07:45:51.946+0000",
            "IL_FUNC_OBJECT_TYPE": "Content",
            "name": "R05_Test",
            "status": "Live",
            "totalQuestions": 1,
            "orgDetails": {},
            "code": "org.sunbird.rLVEAi",
            "description": "ncieioneio",
            "medium": "English",
            "streamingUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21266324379998617614877-latest",
            "idealScreenSize": "normal",
            "posterImage": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21266186999677747214484/artifact/icon_1545638427515.png",
            "createdOn": "2018-12-26T06:35:27.927+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "a0f07d96-8a35-4f4e-a233-ee0a09c8fd5c",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/5dfe8927e565723cfb1c2d2fe5a1ac1f.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1545893080571,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-12-26T07:45:48.738+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2019-05-19T03:08:08.353+0000",
            "dialcodeRequired": "No",
            "owner": "Sachin 2808",
            "creator": "Som r",
            "createdFor": [
                "0125683555607347207"
            ],
            "lastStatusChangedOn": "2019-05-19T03:08:08.340+0000",
            "IL_SYS_NODE_TYPE": "DATA_NODE",
            "os": [
                "All"
            ],
            "totalScore": 4,
            "pkgVersion": 1,
            "versionKey": "1545810348738",
            "idealScreenDensity": "hdpi",
            "framework": "NCF",
            "s3Key": "ecar_files/do_21266324379998617614877/r05_test_1545810351946_do_21266324379998617614877_1.0.ecar",
            "lastSubmittedOn": "2018-12-26T07:45:07.000+0000",
            "me_averageRating": 5,
            "createdBy": "d32e170d-010b-4bc5-ae55-3ac5e547e35b",
            "compatibilityLevel": 4,
            "IL_UNIQUE_ID": "do_21266324379998617614877",
            "ownedBy": "0125683555607347207",
            "board": "CBSE",
            "resourceType": "Test",
            "node_id": 446923
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_21258040361213952015738-latest",
            "subject": "English",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21258040361213952015738/__1559119939572_do_21258040361213952015738_5.0.ecar",
            "organisation": [
                "SAP"
            ],
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21258040361213952015738/__1559119939825_do_21258040361213952015738_5.0_spine.ecar",
                    "size": 33538
                }
            },
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21258040361213952015738/artifact/download-3_1531474695189.thumb.jpg",
            "gradeLevel": [
                "Class 1"
            ],
            "collections": [
                "do_212608901045985280167",
                "do_2126335427795763201487",
                "do_21265908814154137613730",
                "do_212694392468717568118095",
                "do_21265980189786112013956",
                "do_21271627854903705616706",
                "do_212608898352807936164",
                "do_2127730122172579841694",
                "do_2127730188304384001696",
                "do_2127730642698813441698",
                "do_2127731185278074881720",
                "do_2127736460745441281727",
                "do_2127737426502615041759",
                "do_2127781798791577601141",
                "do_2127781975501127681155",
                "do_2127785086812733441158",
                "do_2127785106696355841160",
                "do_2127815506724044801557",
                "do_21279071611953971211627",
                "do_21279071611953971211627.img"
            ],
            "appId": "staging.diksha.app",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21258040361213952015738/artifact/1535697984690_do_21258040361213952015738.zip",
            "contentEncoding": "gzip",
            "sYS_INTERNAL_LAST_UPDATED_ON": "2018-10-03T09:36:54.793+0000",
            "contentType": "Resource",
            "lastUpdatedBy": "74400baf-7f32-407a-9d79-265ecd3f6952",
            "identifier": "do_21258040361213952015738",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "ekstep",
            "languageCode": "en",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "version": 2,
            "prevState": "Review",
            "size": 371123,
            "lastPublishedOn": "2019-05-29T08:52:19.571+0000",
            "name": "!@#$%^&*()_+",
            "status": "Live",
            "totalQuestions": 1,
            "orgDetails": {},
            "code": "org.sunbird.rC8eWN",
            "description": "",
            "medium": "English",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_21258040361213952015738-latest",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21254584070116966411188/artifact/download-3_1531474695189.jpg",
            "idealScreenSize": "normal",
            "createdOn": "2018-08-31T05:36:40.308+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-358",
                    "assertionId": "e338fba4-0064-4225-8791-dcac17f80511",
                    "badgeClassImage": "https://sunbirdstaging.blob.core.windows.net/badgr/uploads/badges/badf0408727b0c90556b5de31829164e.png",
                    "badgeId": "badgeslug-100",
                    "badgeClassName": "Best book",
                    "createdTS": 1537253744517,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2019-05-29T08:52:19.134+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2019-05-30T07:22:39.210+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "012530141516660736208"
            ],
            "creator": "Helington N",
            "lastStatusChangedOn": "2019-05-30T07:22:39.203+0000",
            "os": [
                "All"
            ],
            "totalScore": 1,
            "pkgVersion": 5,
            "versionKey": "1535697983606",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_21258040361213952015738/__1559119939572_do_21258040361213952015738_5.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2019-05-29T08:57:32.552+0000",
            "createdBy": "0e0ea1db-dbad-4202-bc73-dfc8b122296f",
            "compatibilityLevel": 2,
            "board": "CBSE",
            "resourceType": "Learn",
            "node_id": 425893
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_21252611650918809611434/the-problems-of-philosophy-lewistheme.epub",
            "keywords": [
                "Anirban epub"
            ],
            "subject": "Geography",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21252611650918809611434/anirban-epub_1529067178577_do_21252611650918809611434_1.0.ecar",
            "showNotification": true,
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21252611650918809611434/anirban-epub_1529067178772_do_21252611650918809611434_1.0_spine.ecar",
                    "size": 100945
                }
            },
            "mimeType": "application/epub",
            "objectType": "Content",
            "gradeLevel": [
                "Class 1"
            ],
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21252611650918809611434/artifact/localhost_1524724918337.thumb.png",
            "collections": [
                "do_21252660020819558411474",
                "do_21271420346162380816189"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_21252611650918809611434/the-problems-of-philosophy-lewistheme.epub",
            "contentEncoding": "gzip",
            "contentType": "Resource",
            "lastUpdatedBy": "07ebd230-bfed-4d29-a849-f5033d087d66",
            "identifier": "do_21252611650918809611434",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "07ebd230-bfed-4d29-a849-f5033d087d66",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "prevState": "Review",
            "lastPublishedOn": "2018-06-15T12:52:58.577+0000",
            "size": 481709,
            "concepts": [
                "C3"
            ],
            "name": "Anirban epub",
            "status": "Live",
            "orgDetails": {},
            "code": "13e938d6-4327-4a37-b835-19b5b829072c",
            "description": "Anirban epub",
            "medium": "Kannada",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_21252611650918809611434/the-problems-of-philosophy-lewistheme.epub",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124905465279692801410/artifact/localhost_1524724918337.png",
            "idealScreenSize": "normal",
            "createdOn": "2018-06-15T12:49:16.687+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "b02e3191-2418-486e-bf95-f1c8033fb7e7",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/343f9a93e8c2a82ffe36e9ecfbf363f6.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1545893133486,
                    "status": "active"
                },
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "261e77b4-4b1b-49de-affd-aa3c408138f8",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/343f9a93e8c2a82ffe36e9ecfbf363f6.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1546408540297,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-06-15T12:52:58.285+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2019-01-02T05:55:40.853+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "0124758436944117762"
            ],
            "creator": "Demo User",
            "os": [
                "All"
            ],
            "pkgVersion": 1,
            "versionKey": "1529067178285",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_21252611650918809611434/anirban-epub_1529067178577_do_21252611650918809611434_1.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2018-06-15T12:50:16.940+0000",
            "createdBy": "810108e3-0ea2-4b60-9505-1a7757c6409a",
            "compatibilityLevel": 4,
            "board": "CBSE",
            "resourceType": "Practice",
            "node_id": 377569
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_21252884005676646411974-latest",
            "keywords": [
                "ecwewcewce"
            ],
            "subject": "English",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21252884005676646411974/rajasthan_1529399625145_do_21252884005676646411974_1.0.ecar",
            "organisation": [
                "Consumption Org",
                "ORG25"
            ],
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21252884005676646411974/rajasthan_1529399625299_do_21252884005676646411974_1.0_spine.ecar",
                    "size": 51673
                }
            },
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21252884005676646411974/artifact/3_1519885914935.thumb.jpg",
            "gradeLevel": [
                "Class 1"
            ],
            "collections": [
                "do_21275320638107648011033",
                "do_21252944504394547212198",
                "do_21252944428500582412195"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21252884005676646411974/artifact/1529399624900_do_21252884005676646411974.zip",
            "contentEncoding": "gzip",
            "contentType": "Resource",
            "lastUpdatedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
            "identifier": "do_21252884005676646411974",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Relevant Keywords",
                "Appropriate tags such as Resource Type, Concepts",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate Title, Description",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "version": 2,
            "prevState": "Review",
            "size": 153803,
            "lastPublishedOn": "2018-06-19T09:13:45.145+0000",
            "concepts": [
                "SC5",
                "C26",
                "SC6"
            ],
            "name": "Rajasthan",
            "status": "Live",
            "totalQuestions": 0,
            "orgDetails": {},
            "code": "org.sunbird.5gt9FD",
            "description": "Untitled Collection",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_21252884005676646411974-latest",
            "medium": "English",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212450905413713920137/artifact/3_1519885914935.jpg",
            "idealScreenSize": "normal",
            "createdOn": "2018-06-19T09:10:20.991+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "f9554ba0-5958-4a97-b20a-d0d7a04360b1",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/343f9a93e8c2a82ffe36e9ecfbf363f6.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1545893013408,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-06-19T09:13:44.465+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2018-12-27T06:43:33.466+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "01232002070124134414",
                "012315809814749184151"
            ],
            "creator": "Ntp creator Uswr",
            "os": [
                "All"
            ],
            "totalScore": 0,
            "pkgVersion": 1,
            "versionKey": "1529399624465",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_21252884005676646411974/rajasthan_1529399625145_do_21252884005676646411974_1.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2018-06-19T09:12:39.017+0000",
            "createdBy": "659b011a-06ec-4107-84ad-955e16b0a48a",
            "compatibilityLevel": 2,
            "board": "State (Rajasthan)",
            "resourceType": "Test",
            "node_id": 378177
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_2124708443414036481125-latest",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124708443414036481125/chetan-content_1527769448521_do_2124708443414036481125_4.0.ecar",
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124708443414036481125/chetan-content_1527769448613_do_2124708443414036481125_4.0_spine.ecar",
                    "size": 1117
                }
            },
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "objectType": "Content",
            "collections": [
                "do_2124708657568645121145",
                "do_2124708669666263041147"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124708443414036481125/artifact/1522320212461_do_2124708443414036481125.zip",
            "contentEncoding": "gzip",
            "contentType": "Resource",
            "lastUpdatedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
            "identifier": "do_2124708443414036481125",
            "audience": [
                "Learner"
            ],
            "visibility": "Default",
            "consumerId": "56ff6913-abcc-4a88-b247-c976e47cbfb4",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "version": 2,
            "prevState": "Live",
            "license": "Creative Commons Attribution (CC BY)",
            "lastPublishedOn": "2018-05-31T12:24:08.521+0000",
            "size": 5305,
            "name": "Chetan content",
            "status": "Live",
            "orgDetails": {},
            "code": "org.sunbird.tYnEvl",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_2124708443414036481125-latest",
            "idealScreenSize": "normal",
            "createdOn": "2018-03-29T10:37:45.893+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-372",
                    "assertionId": "c5d6a7a5-e84e-4777-8332-a1e87bbde694",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/839ccee9b125f627329d23d66283b45f.png",
                    "badgeId": "badgeslug-116",
                    "badgeClassName": "Dec 11 2018 APRTESTONE ISSUER",
                    "createdTS": 1544525344869,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-05-31T12:24:08.448+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2019-08-15T00:35:39.816+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "01232002070124134414",
                "012315809814749184151"
            ],
            "creator": "Telemetry User",
            "os": [
                "All"
            ],
            "pkgVersion": 4,
            "versionKey": "1527769448448",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_2124708443414036481125/chetan-content_1527769448521_do_2124708443414036481125_4.0.ecar",
            "framework": "FWATMPT1",
            "lastSubmittedOn": "2018-03-29T10:41:28.672+0000",
            "me_averageRating": 5,
            "createdBy": "659b011a-06ec-4107-84ad-955e16b0a48a",
            "compatibilityLevel": 2,
            "resourceType": "Read",
            "node_id": 98964
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125005681201643521507/01.pdf",
            "subject": "History and Civics",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125005681201643521507/123were_1527769732335_do_2125005681201643521507_4.0.ecar",
            "showNotification": true,
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125005681201643521507/123were_1527769733201_do_2125005681201643521507_4.0_spine.ecar",
                    "size": 45773
                }
            },
            "mimeType": "application/pdf",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2125005681201643521507/artifact/111-600x375_1522638521957.thumb.jpg",
            "gradeLevel": [
                "Grade 6"
            ],
            "collections": [
                "do_2127022866268897281467",
                "do_212518123106598912146655.img",
                "do_21252176248861491213236",
                "do_212516115958833152146551.img",
                "do_2125310927864381441577",
                "do_21250340016679321616577",
                "do_2125430205044736001652",
                "do_21252804279848140811599",
                "do_21257827984084992011686",
                "do_2125310927864381441578",
                "do_21251468318021222411980",
                "do_212518123106598912146655",
                "do_212516112227344384146542"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125005681201643521507/01.pdf",
            "contentEncoding": "identity",
            "contentType": "Resource",
            "lastUpdatedBy": "creator12345 Test",
            "identifier": "do_2125005681201643521507",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "68777b59-b28b-4aee-88d6-50d46e4c3509",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "version": 1,
            "pragma": [
                "external"
            ],
            "prevState": "Live",
            "license": "Creative Commons Attribution (CC BY)",
            "lastPublishedOn": "2018-05-31T12:28:52.335+0000",
            "size": 8966834,
            "concepts": [
                "BIO40000",
                "BIO50000"
            ],
            "name": "123were",
            "status": "Live",
            "orgDetails": {},
            "code": "ddd8e812-8126-4d95-b4e1-a92988eda68c",
            "lastFlaggedOn": "2018-07-05T06:38:21.173+0000",
            "medium": "English",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125005681201643521507/01.pdf",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124734547707576321269/artifact/111-600x375_1522638521957.jpg",
            "idealScreenSize": "normal",
            "flaggedBy": [
                "creator12345 Test"
            ],
            "createdOn": "2018-05-10T10:30:56.855+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-57",
                    "assertionId": "5a182f4d-43b1-43c7-a21b-63ce6c24b570",
                    "badgeClassImage": "https://sunbirdstaging.blob.core.windows.net/badgr/uploads/badges/badf0408727b0c90556b5de31829164e.png",
                    "badgeId": "badgeslug-81",
                    "badgeClassName": "Official",
                    "createdTS": 1533710533029,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-07-05T06:39:20.400+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2019-08-23T00:35:42.579+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "01232002070124134414",
                "012315809814749184151"
            ],
            "creator": "Mentor Juthika User",
            "os": [
                "All"
            ],
            "pkgVersion": 4,
            "versionKey": "1530772760400",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_2125005681201643521507/123were_1527769732335_do_2125005681201643521507_4.0.ecar",
            "framework": "FWATMPT1",
            "lastSubmittedOn": "2018-05-10T10:31:54.877+0000",
            "me_averageRating": 5,
            "createdBy": "d882967f-b3e1-456b-b984-d800470837ab",
            "compatibilityLevel": 4,
            "board": "MSCERT",
            "resourceType": "Practice",
            "node_id": 149315
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21264270761184460811673-latest",
            "subject": "Mathematics",
            "channel": "in.ekstep",
            "downloadUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21264270761184460811673/mathematics-activity-class-4_1543303328064_do_21264270761184460811673_2.0.ecar",
            "organisation": [
                "NTP"
            ],
            "language": [
                "English"
            ],
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "variants": {
                "spine": {
                    "ecarUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21264270761184460811673/mathematics-activity-class-4_1543303328175_do_21264270761184460811673_2.0_spine.ecar",
                    "size": 12590
                }
            },
            "editorState": "{\"plugin\":{\"noOfExtPlugins\":14,\"extPlugins\":[{\"plugin\":\"org.ekstep.contenteditorfunctions\",\"version\":\"1.2\"},{\"plugin\":\"org.ekstep.keyboardshortcuts\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.richtext\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.iterator\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.navigation\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.mathtext\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.libs.ckeditor\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.mcq\",\"version\":\"1.1\"},{\"plugin\":\"org.ekstep.questionunit.mtf\",\"version\":\"1.1\"},{\"plugin\":\"org.ekstep.keyboard\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.reorder\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.sequence\",\"version\":\"1.0\"},{\"plugin\":\"org.ekstep.questionunit.ftb\",\"version\":\"1.0\"}]},\"stage\":{\"noOfStages\":2,\"currentStage\":\"83a3d941-3306-429e-aae2-07ca70d744ee\"},\"sidebar\":{\"selectedMenu\":\"settings\"}}",
            "objectType": "Content",
            "gradeLevel": [
                "Class 4"
            ],
            "appIcon": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21264270761184460811673/artifact/0288d78758c4463dd40892d5a460edf4_1478578597914.thumb.jpeg",
            "me_totalTimespent": 31.8,
            "collections": [
                "do_21264701641690316813698",
                "do_21280690397737779211227",
                "do_21280689455348121611201",
                "do_21280691880382464011277",
                "do_21280762824795750411925",
                "do_21280762824795750411925.img",
                "do_21283180802014412811765",
                "do_212832384100474880153"
            ],
            "me_averageTimespentPerSession": 31.8,
            "appId": "staging.diksha.portal",
            "contentEncoding": "gzip",
            "artifactUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21264270761184460811673/artifact/1543303326995_do_21264270761184460811673.zip",
            "contentType": "Resource",
            "identifier": "do_21264270761184460811673",
            "lastUpdatedBy": "b9a3972c-a2ba-46fa-9279-59ce21957a83",
            "audience": [
                "Learner"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "lastPublishedBy": "7bd5aef5-d825-47fa-96b5-3a3ce3b4020b",
            "version": 2,
            "prevState": "Review",
            "license": "Creative Commons Attribution (CC BY)",
            "size": 562094,
            "lastPublishedOn": "2018-11-27T07:22:07.149+0000",
            "IL_FUNC_OBJECT_TYPE": "Content",
            "name": "Mathematics Activity - Class 4",
            "attributions": [
                "DIKSHA"
            ],
            "status": "Live",
            "totalQuestions": 5,
            "me_averageInteractionsPerMin": 0,
            "orgDetails": {},
            "code": "org.sunbird.aFaNPB",
            "me_totalSessionsCount": 1,
            "description": "Grade 4 Math Activity",
            "medium": "English",
            "streamingUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21264270761184460811673-latest",
            "idealScreenSize": "normal",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20052111/artifact/0288d78758c4463dd40892d5a460edf4_1478578597914.jpeg",
            "createdOn": "2018-11-27T06:14:29.024+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "2c8c6351-d098-4522-937c-38d78e2a129b",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/4d0f1b1dea2ce9ed399f88e5fe8792fa.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1545893035212,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-11-27T07:22:05.791+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2019-09-11T00:36:40.503+0000",
            "dialcodeRequired": "No",
            "owner": "DemoCreator Creator",
            "creator": "DemoCreator Creator",
            "createdFor": [
                "ORG_001"
            ],
            "IL_SYS_NODE_TYPE": "DATA_NODE",
            "os": [
                "All"
            ],
            "me_totalInteractions": 0,
            "totalScore": 5,
            "pkgVersion": 2,
            "versionKey": "1543303326455",
            "idealScreenDensity": "hdpi",
            "framework": "NCF",
            "s3Key": "ecar_files/do_21264270761184460811673/mathematics-activity-class-4_1543303328064_do_21264270761184460811673_2.0.ecar",
            "lastSubmittedOn": "2018-11-27T07:20:23.559+0000",
            "me_averageRating": 5,
            "createdBy": "b9a3972c-a2ba-46fa-9279-59ce21957a83",
            "compatibilityLevel": 2,
            "IL_UNIQUE_ID": "do_21264270761184460811673",
            "ownedBy": "b9a3972c-a2ba-46fa-9279-59ce21957a83",
            "board": "State (Tamil Nadu)",
            "resourceType": "Test",
            "node_id": 440472
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "subject": "Physical Science",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21259106171407564812108/contentsep_1536996482030_do_21259106171407564812108_1.0.ecar",
            "organisation": [
                "1.10 Org"
            ],
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21259106171407564812108/contentsep_1536996482107_do_21259106171407564812108_1.0_spine.ecar",
                    "size": 22783
                }
            },
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21259106171407564812108/artifact/beee6757847b84a1e41ce827ae02ccc7_1477485749628.thumb.jpeg",
            "gradeLevel": [
                "Class 9"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_21259106171407564812108/artifact/1536996481813_do_21259106171407564812108.zip",
            "contentEncoding": "gzip",
            "contentType": "Resource",
            "lastUpdatedBy": "871e9976-4f96-43bd-986b-91b92c57dbfc",
            "identifier": "do_21259106171407564812108",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Relevant Keywords",
                "Appropriate tags such as Resource Type, Concepts",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate Title, Description",
                "Language is simple to understand",
                "No Spelling mistakes in the text",
                "Audio (if any) is clear and easy to understand",
                "Can see the content clearly on Desktop and App",
                "Content plays correctly"
            ],
            "visibility": "Default",
            "consumerId": "56ff6913-abcc-4a88-b247-c976e47cbfb4",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "871e9976-4f96-43bd-986b-91b92c57dbfc",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "prevState": "Review",
            "size": 367829,
            "lastPublishedOn": "2018-09-15T07:28:02.030+0000",
            "name": "ContentSep",
            "status": "Live",
            "totalQuestions": 1,
            "orgDetails": {},
            "code": "org.sunbird.ooPeyD",
            "description": "Untitled Collection",
            "medium": "Telugu",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/beee6757847b84a1e41ce827ae02ccc7_1477485749628.jpeg",
            "idealScreenSize": "normal",
            "createdOn": "2018-09-15T07:00:38.143+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-376",
                    "assertionId": "62cc4979-04f9-4da1-862e-ce4c49458ba7",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/343f9a93e8c2a82ffe36e9ecfbf363f6.png",
                    "badgeId": "badgeslug-120",
                    "badgeClassName": "STATE TEXTBOOK5",
                    "createdTS": 1545133359941,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-09-15T07:28:00.564+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2018-12-18T11:42:40.059+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "0125903113586933768"
            ],
            "creator": "1.10Creator User",
            "os": [
                "All"
            ],
            "totalScore": 1,
            "pkgVersion": 1,
            "versionKey": "1536996480564",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_21259106171407564812108/contentsep_1536996482030_do_21259106171407564812108_1.0.ecar",
            "framework": "ap_k-12_13",
            "lastSubmittedOn": "2018-09-15T07:01:55.763+0000",
            "createdBy": "644da49c-7bef-49d6-8e24-e741d148d652",
            "compatibilityLevel": 2,
            "board": "State (Andhra Pradesh)",
            "resourceType": "Teach",
            "node_id": 428793
        }
    ];

    contentList1 = [
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21256975952798515213721-latest",
            "keywords": [
                "dadaf"
            ],
            "subject": "Tamil",
            "channel": "in.ekstep",
            "downloadUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21256975952798515213721/creation-100100_1542778850847_do_21256975952798515213721_2.0.ecar",
            "organisation": [
                "Sachin 2808"
            ],
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar_files/do_21256975952798515213721/creation-100100_1542778851702_do_21256975952798515213721_2.0_spine.ecar",
                    "size": 797118
                }
            },
            "mimeType": "application/vnd.ekstep.ecml-archive",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124899901836247041294/artifact/0306022-1.jpg_1524657005308.jpg",
            "gradeLevel": [
                "Class 2"
            ],
            "collections": [
                "do_21256985173761228816314",
                "do_2124396034467676161971",
                "do_21256984927485952016311"
            ],
            "appId": "staging.sunbird.portal",
            "artifactUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21256975952798515213721/artifact/1542778847745_do_21256975952798515213721.zip",
            "contentEncoding": "gzip",
            "contentType": "Resource",
            "lastUpdatedBy": "8d28e44c-b295-42be-8417-dd756486ff85",
            "identifier": "do_21256975952798515213721",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "fa271a76-c15a-4aa1-adff-31dd04682a1f",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "86dd77ad-18d7-4d27-b72c-ba732b4009d3",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "version": 2,
            "prevState": "Processing",
            "lastPublishedOn": "2018-11-21T05:40:48.675+0000",
            "size": 7813097,
            "name": "Creation 100100",
            "attributions": [
                "testing"
            ],
            "status": "Live",
            "totalQuestions": 2,
            "orgDetails": {},
            "code": "org.sunbird.WtVkXR",
            "description": "trikjr",
            "medium": "Telugu",
            "streamingUrl": "https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/ecml/do_21256975952798515213721-latest",
            "idealScreenSize": "normal",
            "createdOn": "2018-08-20T06:10:37.421+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-345",
                    "assertionId": "fa2ec612-18da-4048-b146-a8846588a9a5",
                    "badgeClassImage": "https://sunbirdstaging.blob.core.windows.net/badgr/uploads/badges/badf0408727b0c90556b5de31829164e.png",
                    "badgeId": "badgeslug-85",
                    "badgeClassName": "Best guide",
                    "createdTS": 1534759115237,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-11-21T05:40:45.040+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2018-11-21T05:40:51.986+0000",
            "createdFor": [
                "0125683555607347207"
            ],
            "creator": "Sham r",
            "os": [
                "All"
            ],
            "totalScore": 3,
            "pkgVersion": 2,
            "versionKey": "1542778846752",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_21256975952798515213721/creation-100100_1542778850847_do_21256975952798515213721_2.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2018-08-16T04:50:00.554+0000",
            "createdBy": "8d28e44c-b295-42be-8417-dd756486ff85",
            "compatibilityLevel": 2,
            "board": "CBSE",
            "resourceType": "Learn",
            "node_id": 409230
        },
        {
            "ownershipType": [
                "createdBy"
            ],
            "previewUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125047996214067201105/pdf-sample.pdf",
            "keywords": [
                "test"
            ],
            "subject": "Urdu",
            "channel": "in.ekstep",
            "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125047996214067201105/16may-pdf-upload_1538552344206_do_2125047996214067201105_4.0.ecar",
            "showNotification": true,
            "language": [
                "English"
            ],
            "variants": {
                "spine": {
                    "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125047996214067201105/16may-pdf-upload_1538552344279_do_2125047996214067201105_4.0_spine.ecar",
                    "size": 13413
                }
            },
            "mimeType": "application/pdf",
            "objectType": "Content",
            "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2125047996214067201105/artifact/1466505161547apple.thumb.png",
            "gradeLevel": [
                "Class 2"
            ],
            "collections": [
                "do_21257125420203212817093",
                "do_21257827911837286411681",
                "do_21257133955701145617133",
                "do_21257124179043123217073",
                "do_21257142133474918417187",
                "do_21260466111629721611377",
                "do_21257125905047552017102",
                "do_2126138400531742721505",
                "do_21257131794698240017119",
                "do_21257136897708851217164",
                "do_21257144778190028817196",
                "do_21260466236003942411379",
                "do_21257124195636838417074",
                "do_21257135975308492817152",
                "do_21260465839606988811374",
                "do_21257136783278080017162",
                "do_21271796456817459211808",
                "do_2126138352511385601500",
                "do_2127099066970193921930",
                "do_21257131719372800017118",
                "do_21257144699138048017195"
            ],
            "appId": "staging.diksha.portal",
            "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125047996214067201105/pdf-sample.pdf",
            "contentEncoding": "identity",
            "sYS_INTERNAL_LAST_UPDATED_ON": "2018-10-03T07:39:04.363+0000",
            "contentType": "Resource",
            "lastUpdatedBy": "bb335f84-f624-4bdd-9e5e-95c62dc690ff",
            "identifier": "do_2125047996214067201105",
            "audience": [
                "Learner"
            ],
            "publishChecklist": [
                "No Hate speech, Abuse, Violence, Profanity",
                "No Sexual content, Nudity or Vulgarity",
                "No Discrimination or Defamation",
                "Is suitable for children",
                "Appropriate Title, Description",
                "Correct Board, Grade, Subject, Medium",
                "Appropriate tags such as Resource Type, Concepts",
                "Relevant Keywords",
                "Content plays correctly",
                "Can see the content clearly on Desktop and App",
                "Audio (if any) is clear and easy to understand",
                "No Spelling mistakes in the text",
                "Language is simple to understand"
            ],
            "visibility": "Default",
            "consumerId": "a9cb3a83-a164-4bf0-aa49-b834cebf1c07",
            "mediaType": "content",
            "osId": "org.ekstep.quiz.app",
            "lastPublishedBy": "bb335f84-f624-4bdd-9e5e-95c62dc690ff",
            "languageCode": "en",
            "graph_id": "domain",
            "nodeType": "DATA_NODE",
            "pragma": [
                "external"
            ],
            "prevState": "Live",
            "lastPublishedOn": "2018-10-03T07:39:04.206+0000",
            "size": 17905,
            "concepts": [
                "AI33"
            ],
            "name": "16MAY-PDF Upload",
            "status": "Live",
            "orgDetails": {},
            "code": "be8e0283-d492-4d64-8e44-a00b8e856512",
            "description": "testing by umesh",
            "medium": "Telugu",
            "streamingUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125047996214067201105/pdf-sample.pdf",
            "posterImage": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/1466505161547apple.png",
            "idealScreenSize": "normal",
            "createdOn": "2018-05-16T09:59:57.534+0000",
            "badgeAssertions": [
                {
                    "issuerId": "issuerslug-377",
                    "assertionId": "236121b8-b2fd-4c62-85a9-5f011433f3e8",
                    "badgeClassImage": "https://ntpstaging.blob.core.windows.net/badgr/uploads/badges/343f9a93e8c2a82ffe36e9ecfbf363f6.png",
                    "badgeId": "badgeslug-121",
                    "badgeClassName": "Best author",
                    "createdTS": 1545893001107,
                    "status": "active"
                }
            ],
            "contentDisposition": "inline",
            "lastUpdatedOn": "2018-10-03T07:39:03.405+0000",
            "SYS_INTERNAL_LAST_UPDATED_ON": "2018-12-27T06:43:21.205+0000",
            "dialcodeRequired": "No",
            "createdFor": [
                "01250469287604224011"
            ],
            "creator": "May creator",
            "os": [
                "All"
            ],
            "pkgVersion": 4,
            "versionKey": "1534575021960",
            "idealScreenDensity": "hdpi",
            "s3Key": "ecar_files/do_2125047996214067201105/16may-pdf-upload_1538552344206_do_2125047996214067201105_4.0.ecar",
            "framework": "NCF",
            "lastSubmittedOn": "2018-05-16T10:01:30.626+0000",
            "createdBy": "9541757e-976e-47ee-b981-2f0f312529b0",
            "compatibilityLevel": 4,
            "attribution": "test",
            "board": "CBSE",
            "resourceType": "Test",
            "node_id": 199891
        }
    ];

    title = 'desktopLibTest';
    viewAllButtonText = 'View all';

    public subjects = ['english', 'mathematics', 'geology', 'biology', 'zoology', 'Botany', 'Environmental Science'];
    public mediums = [
        'english',
        'mathematics',
        'geology',
        'biology',
        'zoology',
        'Botany',
        'Environmental Science'
    ];

    classes = [
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7'
    ]

    /* Hardcoded data */

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageApiService: PageApiService,
        private utilService: UtilService,
        private toasterService: ToasterService,
        private configService: ConfigService,
        private resourceService: ResourceService,
        private orgDetailsService: OrgDetailsService,
        public offlineFileUploaderService: OfflineFileUploaderService,
    ) { }

    ngOnInit() {
        this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).pipe(
            mergeMap((orgDetails: any) => {
                this.slug = orgDetails.slug;
                this.hashTagId = orgDetails.hashTagId;
                this.initFilters = true;
                this.organisationId = orgDetails.id;
                return this.dataDrivenFilterEvent;
            }), first()
        ).subscribe((filters: any) => {
            this.dataDrivenFilters = filters;
            this.fetchContentOnParamChange();
            // this.setNoResultMessage();
        },
            error => {
                console.error("Error", error);
                this.router.navigate(['']);
            }
        );

        setTimeout(() => {
            this.dataDrivenFilterEvent.emit([]);
        }, 1000);
        this.offlineFileUploaderService.isUpload.subscribe(() => {
            this.fetchPageData();
        });
    }

    private fetchContentOnParamChange() {
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
            takeUntil(this.unsubscribe$))
            .subscribe((result) => {
                this.showLoader = true;
                this.queryParams = { ...result[1] };
                this.carouselMasterData = [];
                this.pageSections = [];
                this.fetchPageData();
            });
    }

    private fetchPageData() {
        const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
            if (_.includes(['sort_by', 'sortType', 'appliedFilters'], key)) {
                return false;
            }
            return value.length;
        });
        const softConstraintData = {
            filters: {
                channel: this.hashTagId,
                board: [this.dataDrivenFilters.board]
            },
            softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
            mode: 'soft'
        };
        const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
            softConstraintData);
        const option = {
            organisationId: this.organisationId,
            source: 'web',
            name: 'Explore',
            filters: _.get(this.queryParams, 'appliedFilters') ? filters : _.get(manipulatedData, 'filters'),
            mode: _.get(manipulatedData, 'mode'),
            exists: [],
            params: this.configService.appConfig.ExplorePage.contentApiQueryParams
        };
        if (_.get(manipulatedData, 'filters')) {
            option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
        }
        this.pageApiService.getPageData(option)
            .subscribe(data => {
                console.log("data", data);
                this.showLoader = false;
                // this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
                if (!this.carouselMasterData.length) {
                    return; // no page section
                }
                if (this.carouselMasterData.length >= 2) {
                    this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
                } else if (this.carouselMasterData.length >= 1) {
                    this.pageSections = [this.carouselMasterData[0]];
                }
            }, err => {
                this.showLoader = false;
                this.carouselMasterData = [];
                this.pageSections = [];
                this.toasterService.error(this.resourceService.messages.fmsg.m0004);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
