import {
  PaginationService, ResourceService, ConfigService, ToasterService, OfflineCardService, ILoaderMessage, UtilService, NavigationHelperService, IPagination, LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { SearchService, OrgDetailsService, UserService, FrameworkService, SchemaService } from '@sunbird/core';
import { PublicPlayerService } from '../../../../services';
import { combineLatest, Subject, of } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, debounceTime, tap, delay } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { ContentManagerService } from '../../../offline/services';
import {omit, groupBy, get, uniqBy, toLower, find, map as _map, forEach, each} from 'lodash-es';

@Component({
  templateUrl: './explore-content.component.html',
  styleUrls: ['./explore-content.component.scss']
})
export class ExploreContentComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage;
  public filterType: string;
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public dataDrivenFilters: any = {};
  public dataDrivenFilterEvent = new EventEmitter();
  public initFilters = false;
  public facets: Array<string>;
  public facetsList: any;
  public paginationDetails: IPagination;
  public contentList: Array<any> = [];
  public cardIntractEdata: IInteractEventEdata;
  public loaderMessage: ILoaderMessage;
  public numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);
  showExportLoader = false;
  contentName: string;
  showDownloadLoader = false;
  frameworkId;
  public globalSearchFacets: Array<string>;
  public allTabData;
  public selectedFilters;
  public formData;
  layoutConfiguration;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  public totalCount;
  public searchAll;
  public allMimeType;
  downloadIdentifier: string;
  contentDownloadStatus = {};
  contentData;
  showModal = false;
  isDesktopApp = false;
  showBackButton = false;

  constructor(public searchService: SearchService, public router: Router,
    public activatedRoute: ActivatedRoute, public paginationService: PaginationService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public configService: ConfigService, public utilService: UtilService, public orgDetailsService: OrgDetailsService,
    public navigationHelperService: NavigationHelperService, private publicPlayerService: PublicPlayerService,
    public userService: UserService, public frameworkService: FrameworkService,
    public cacheService: CacheService, public navigationhelperService: NavigationHelperService, public layoutService: LayoutService,
    public contentManagerService: ContentManagerService, private offlineCardService: OfflineCardService,
    public telemetryService: TelemetryService, private schemaService: SchemaService) {
    this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
    this.filterType = this.configService.appConfig.exploreNew.filterType;
  }
  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
      this.queryParams = { ...queryParams };
      this.utilService.setNcertPublisher(true);
    });
    this.searchService.getContentTypes().pipe(takeUntil(this.unsubscribe$)).subscribe(formData => {
      this.allTabData = _.find(formData, (o) => o.title === 'frmelmnts.tab.all');
      this.formData = formData;
      this.globalSearchFacets = (this.queryParams && this.queryParams.searchFilters) ?
      JSON.parse(this.queryParams.searchFilters) : _.get(this.allTabData, 'search.facets');
      this.listenLanguageChange();
      this.initFilters = true;
    }, error => {
      this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
      this.navigationhelperService.goBack();
    });

    this.initLayout();
    this.frameworkService.channelData$.pipe(takeUntil(this.unsubscribe$)).subscribe((channelData) => {
      if (!channelData.err) {
        this.frameworkId = _.get(channelData, 'channelData.defaultFramework');
      }
    });
    this.orgDetailsService.getOrgDetails(this.userService.slug).pipe(
      mergeMap((orgDetails: any) => {
        this.hashTagId = orgDetails.hashTagId;
        this.initFilters = true;
        return this.dataDrivenFilterEvent;
      }), first()
    ).subscribe((filters: any) => {
      this.dataDrivenFilters = filters;
      this.fetchContentOnParamChange();
      console.log("Fetch content on param change");
      this.setNoResultMessage();
    },
      error => {
        this.router.navigate(['']);
      }
    );
    this.searchAll = this.resourceService.frmelmnts.lbl.allContent;
    this.contentManagerService.contentDownloadStatus$.subscribe( contentDownloadStatus => {
      this.contentDownloadStatus = contentDownloadStatus;
      this.addHoverData();
    });
    this.checkForBack();
    this.moveToTop();
  }
  goback() {
    if (this.navigationhelperService['_history'].length > 1) {
      this.navigationhelperService.goBack();
    }
  }
  checkForBack() {
    if (_.get(this.activatedRoute, 'snapshot.queryParams["showClose"]') === 'true') {
      this.showBackButton = true;
    }
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.layoutService.switchableLayout().
      pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }
  redoLayout() {
    if (this.layoutConfiguration != null) {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
    } else {
      this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
      this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
    }
  }
  public getFilters(filters) {
    const filterData = filters && filters.filters || {};
    if (filterData.channel && this.facets) {
      const channelIds = [];
      const facetsData = _.find(this.facets, { 'name': 'channel' });
      _.forEach(filterData.channel, (value, index) => {
        const data = _.find(facetsData.values, { 'identifier': value });
        if (data) {
          channelIds.push(data.name);
        }
      });
      if (channelIds && Array.isArray(channelIds) && channelIds.length > 0) {
        filterData.channel = channelIds;
      }
    }
    this.selectedFilters = filterData;
    console.log("Selected filters", this.selectedFilters);
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
      if (element.code === 'board') {
        collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
      }
      return collector;
    }, {});
    this.dataDrivenFilterEvent.emit({});
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams, this.schemaService.fetchSchemas())
      .pipe(debounceTime(5),
        tap(data => this.inView({ inview: [] })),
        delay(10),
        tap(data => this.setTelemetryData()),
        map(result => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$)
      ).subscribe(({ params, queryParams }) => {
        this.showLoader = true;
        this.paginationDetails.currentPage = params.pageNumber;
        this.queryParams = { ...queryParams };
        this.contentList = [];
        this.fetchContents();
      });
  }
  private fetchContents() {
    const selectedMediaType = _.isArray(_.get(this.queryParams, 'mediaType')) ? _.get(this.queryParams, 'mediaType')[0] :
      _.get(this.queryParams, 'mediaType');
    const mimeType = _.find(_.get(this.allTabData, 'search.filters.mimeType'), (o) => {
      return o.name === (selectedMediaType || 'all');
    });
    const pageType = _.get(this.queryParams, 'pageTitle');
    const filters: any = this.schemaService.schemaValidator({
      inputObj: this.queryParams || {}, properties: _.get(this.schemaService.getSchema('content'), 'properties') || {},
      omitKeys: ['key', 'sort_by', 'sortType', 'appliedFilters', 'softConstraints', 'selectedTab', 'description', 'mediaType', 'contentType', 'searchFilters', 'utm_source']
    });
    if (!filters.channel) {
      filters.channel = this.hashTagId;
    }
    // if (this.queryParams.selectedTab == 'textbook') {
    //   filters.publisher = 'NCERT';
    // } else {
    //   delete filters.publisher;
    // }
    const _filters = _.get(this.allTabData, 'search.filters');
    switch(this.queryParams.selectedTab) {
      case 'course': 
        filters.primaryCategory = ['Course', 'Course Assessment'];
        break;
      case 'textbook': 
        filters.primaryCategory = ['Digital Textbook'];
        filters.identifier = [
          "do_3129754499118284801855",
          "do_31307360982266675212185",
          "do_31307361004425216012890",
          "do_31307361012977664013161",
          "do_31307360999220019213261",
          "do_31307360993135820812820",
          "do_31307361009712332813027",
          "do_31307360989756620812582",
          "do_31307360996459315213259",
          "do_31307360995984998412692",
          "do_31307360994390835212691",
          "do_31307360997430067213266",
          "do_31307361000887910413075",
          "do_31307361001588326413385",
          "do_31307360991884083212735",
          "do_31307360993733836812154",
          "do_31307361010721587212565",
          "do_31307360981331968012448",
          "do_31307360983754342411984",
          "do_31307361004145868813509",
          "do_31307361011307315213466",
          "do_31307361003202150412889",
          "do_31307360978409062412109",
          "do_31307360985935052811986",
          "do_31307360998558105612775",
          "do_31307361010021990413704",
          "do_31307360999443660812776",
          "do_31307360995279667212629",
          "do_31307360986278297612919",
          "do_31307360981579366412184",
          "do_31307360984031232012248",
          "do_31307361001854566413386",
          "do_31307360978685952012110",
          "do_31307360978066636812108",
          "do_31307360995637657612919",
          "do_31307361008750592013024",
          "do_31307361000077721613262",
          "do_31307360998918553612789",
          "do_31307360992889241612387",
          "do_31307360992654131212386",
          "do_31307361005661388813234",
          "do_31307360997990400013260",
          "do_31307361012326400014396",
          "do_313078849839497216111465",
          "do_31307361006938521613357",
          "do_31307361007970713613023",
          "do_31307360980016332812170",
          "do_31307360980371865611945",
          "do_31307360984360550412689",
          "do_31307360988662169612546",
          "do_31307360988104294412732",
          "do_31307360989003776012378",
          "do_31307360987189248012646",
          "do_31307360980973158412291",
          "do_31307360992317440012385",
          "do_31307361009021747213025",
          "do_31307361004992102412790",
          "do_31307361013557657613661",
          "do_31307360997163827212155",
          "do_31307360993998438412496",
          "do_31307360983484006412151",
          "do_31307360984936448012249",
          "do_31307360978968576011742",
          "do_31307360989417472012083",
          "do_31307360977492377611752",
          "do_31307360986587136012920",
          "do_31307360982843392011983",
          "do_31307360985351782412918",
          "do_31307360984648908812629",
          "do_31307360994716057613258",
          "do_31307360994997043212822",
          "do_31307360987826585612731",
          "do_31307360987577548812153",
          "do_31307361002233036812887",
          "do_31307361006644428813356",
          "do_31307361003895193613771",
          "do_31307360991086182412733",
          "do_31307360993418444812821",
          "do_31307361010343116813705",
          "do_31307361005917798413307",
          "do_31307360985671270411985",
          "do_31307360990084300813077",
          "do_31307360986860748812152",
          "do_31307361001204121613384",
          "do_31307360979353600012111",
          "do_31307360996859084812810",
          "do_31307361013268480012698",
          "do_31307360999754137612777",
          "do_31307361008470425612396",
          "do_31307360991372083212324",
          "do_31307361015282892813736",
          "do_31307360982542745612304",
          "do_31307361006395392013511",
          "do_31307361011058278413556",
          "do_31307361003443814413160",
          "do_31307361005351731213233",
          "do_31307360979771392012169",
          "do_31307360991653068812734",
          "do_31307360998265651213051",
          "do_31307360983151411212150",
          "do_31307361012648345613660",
          "do_31307361002572185612888",
          "do_31307361379302604814701",
          "do_31307361373007872014909",
          "do_31307361347828121614651",
          "do_31307361380250419215174",
          "do_31307361374283366416042",
          "do_31307361347584819213944",
          "do_31307361361373593615245",
          "do_31307361358818508814137",
          "do_31307361358568652813336",
          "do_31307361348843929613140",
          "do_31307361355599872014235",
          "do_31307361356337152014236",
          "do_31307361392037888017528",
          "do_31307361386364928015658",
          "do_31307361346994176015020",
          "do_31307361350859161613142",
          "do_31307361344335052814923",
          "do_31307361348053401614378",
          "do_31307361390903296016556",
          "do_31307361354907648014234",
          "do_31307361362561433614241",
          "do_31307361380663296014208",
          "do_31307361362193612814139",
          "do_31307361370653491213542",
          "do_31307361370942668814459",
          "do_31307361364920729616235",
          "do_31307361384619212814361",
          "do_31307361378931507214700",
          "do_31307361350314393613693",
          "do_31307361357044121614237",
          "do_31307361345362329613942",
          "do_31307361346723840014650",
          "do_31307361355825152013860",
          "do_31307361356711526413530",
          "do_31307361352086323213336",
          "do_31307361363170918416186",
          "do_31308538419512934411737",
          "do_31307361360369254415114",
          "do_31307361389900595215662",
          "do_31307361378358886413630",
          "do_31307361371200716816728",
          "do_31307361385846374414317",
          "do_31307361386989158416431",
          "do_31307361384361984014420",
          "do_31307361391474278415987",
          "do_31307361377830502416863",
          "do_31307361387748556815660",
          "do_31307361385481011216310",
          "do_31307361377552793613544",
          "do_31307361375741542416047",
          "do_31307361381307187216127",
          "do_31307361391754444816557",
          "do_31307361363785318414249",
          "do_31307361363490406415201",
          "do_31307361371508736014703",
          "do_31307361381960089614264",
          "do_31307361362904678414140",
          "do_31307361378098380813545",
          "do_31307361375251660816045",
          "do_31307361384040857616309",
          "do_31307361357388185614238",
          "do_31307361349470617614713",
          "do_31307361357840384015005",
          "do_31307361349878579213191",
          "do_31307361358196736014239",
          "do_31307361376000409616861",
          "do_31307361364073676814096",
          "do_31307361372412313614704",
          "do_31307361374995251216044",
          "do_31307361353638707213337",
          "do_31307361388282675214529",
          "do_31307361354240000014884",
          "do_31307361355266457613823",
          "do_31307361351100006413143",
          "do_31307361346292121613139",
          "do_31307361351850393614882",
          "do_31307361344935526413558",
          "do_31307361348419584014652",
          "do_31307361349093785614547",
          "do_31307361385150873615609",
          "do_31307361374677401616043",
          "do_31307361370366771214045",
          "do_31307361364327628815246",
          "do_31307361372169011214046",
          "do_31307361350601932813141",
          "do_31307361351604633614173",
          "do_31307361388815155217370",
          "do_31307361352339456015285",
          "do_31307361378652979213631",
          "do_31307361365734195214495",
          "do_31307361386769612815659",
          "do_31307361387227545616432",
          "do_31307361372707225615560",
          "do_31307361389359104016554",
          "do_31307361388000051217165",
          "do_31307361388530892817369",
          "do_31307361345730969613344",
          "do_31307361353928704014883",
          "do_31307361387463475216433",
          "do_31307361352581939213754",
          "do_31307361360664985613771",
          "do_31307361354590617613983",
          "do_31307361346011136013943",
          "do_31304114863693004811624",
          "do_31340017406911283212329",
          "do_31340071663497216011145",
          "do_31340071846760448012732",
          "do_31340072040719974412769",
          "do_31340073137148723211159",
          "do_3134001543147028481952",
          "do_31340073298337792013017",
          "do_31340073493079654411177",
          "do_31340073779555532813053",
          "do_31340075898604748813152",
          "do_31340076552077312013167",
          "do_31340077069775667211528",
          "do_31340077248761036811531",
          "do_31340077544924774411571",
          "do_31340077726882201613225",
          "do_31340077907106201613227",
          "do_31340078330746470411594",
          "do_31340078547050496013239",
          "do_31340078723778969613246",
          "do_31340083304307097613465",
          "do_3130390640724459521898",
          "do_3130044527844311041334",
          "do_31321909244829696012566",
          "do_3132246897170186241552",
          "do_3132294705323130881328",
          "do_3132246897518346241579",
          "do_3132294705322803201531",
          "do_31322182211950182414211",
          "do_31322182212494131214217",
          "do_31321909245696409612537",
          "do_3132246897294213121558",
          "do_31322182214609305613236",
          "do_3132294648255283201315",
          "do_3132294636523765761286",
          "do_3132246897224335361425",
          "do_3132246897256939521555",
          "do_31329619717643468813738",
          "do_31321909248121241612852",
          "do_31322468976644915211103",
          "do_3132294648262328321253",
          "do_3132246897544232961582",
          "do_31321909249184563212858",
          "do_31321909244565094412563",
          "do_31322182214407782413233",
          "do_3132246897007083521416",
          "do_3132246897321164801561",
          "do_3132246897493032961576",
          "do_31322816539528396811335",
          "do_31322182211315302414205",
          "do_31329618325195161613718",
          "do_31321909245482598412174",
          "do_31322468976171417611097",
          "do_31321909247035801612574",
          "do_313286143375745024114046",
          "do_3132246897411112961570",
          "do_3132294648255692801251",
          "do_31321909247687884812582",
          "do_31322182212914380814223",
          "do_3132246897380884481567",
          "do_31321909248548864011034",
          "do_3132294636507873281244",
          "do_31322182212231987214214",
          "do_31321909249394278412587",
          "do_31321909246137139212568",
          "do_3132294648255365121518",
          "do_31321909247891865612585",
          "do_31321909248770048012586",
          "do_3132246897114316801547",
          "do_31322816896095846412792",
          "do_31322182213515673614229",
          "do_3132294705321738241289",
          "do_3132294636523847681287",
          "do_3132294636539412481308",
          "do_3132294648262246401252",
          "do_31329617181814784013710",
          "do_31322468977102848011106",
          "do_31321909249804697612866",
          "do_3132294636539248641307",
          "do_31322182210604236814199",
          "do_3132294705321984001327",
          "do_3132294705317396481326",
          "do_3132131230917263361639",
          "do_31322901943306649615292",
          "do_3132294570334208001347",
          "do_31322468976388505611100",
          "do_31322182213962956814235",
          "do_3132294648255119361517",
          "do_3132131172638064641515",
          "do_3132294705322721281290",
          "do_3132294636504760321271",
          "do_31322468974692761611091",
          "do_31322182210111897615326",
          "do_31321909245272064012171",
          "do_3132246897594613761585",
          "do_3132294648256675841275",
          "do_31321909244166963212562",
          "do_31322182213745049614232",
          "do_3132294648255365121250",
          "do_31321909250019328012867",
          "do_3132294636539494401309",
          "do_31321909247474073612579",
          "do_3132246897144709121422",
          "do_31322468975682355211094",
          "do_31322182212699750414220",
          "do_31322182211705241614208",
          "do_31321909246799872012571",
          "do_3132294705322065921300",
          "do_31322182213162598414226",
          "do_31321909246352588812178",
          "do_3132290149085757441862",
          "do_31322901190323404812494",
          "do_3132131206762168321375",
          "do_31321909245910220812175",
          "do_3132131146000711681410",
          "do_3132246897052221441419",
          "do_31321909245057433612567",
          "do_3132138745776947201599",
          "do_3132246897690951681588",
          "do_3132246897354670081564",
          "do_31321909246568038412181",
          "do_313305848336654336118502",
          "do_31321909248994508812855",
          "do_31322902366489804811503",
          "do_31322182210908160014202",
          "do_31331789216402636811300",
          "do_313004530830401536139",
          "do_312939398695624704125",
          "do_3129505549046824961123",
          "do_3130270806130114561122",
          "do_3130390709396930561900",
          "do_3130390665100165121300",
          "do_3129372292389928961198",
          "do_31291521464536268819635",
          "do_31290743254038118413043",
          "do_3130335324985507841785",
          "do_31331802673500979211671",
          "do_3129846663695892481169",
          "do_3129960844978176001102",
          "do_3130208882520883201132",
          "do_313276191815827456122270",
          "do_31337735402459136011795",
          "do_31304836085375795211095",
          "do_31304837972258816011236",
          "do_3130483544576327681851",
          "do_31304836852849049611286",
          "do_3130150213538693121307",
          "do_3130298487048519681255",
          "do_3130390774707240961303",
          "do_3130504693786624001763",
          "do_312995889594097664151",
          "do_3130390953007513601539",
          "do_3130150353462312961338",
          "do_31306607645382246419451",
          "do_3130504906511482881658",
          "do_31308384418115584011007",
          "do_31305047532843008011401",
          "do_3130483501443317761850",
          "do_3130390916007936001538",
          "do_31298608076202803215",
          "do_3129719285036892161632",
          "do_31306602942515609619239",
          "do_3130504626213027841289",
          "do_31308385293640499212483",
          "do_31306530760135475219436",
          "do_3130390825317335041902",
          "do_3130880586182574081402",
          "do_31308524404318208011751",
          "do_3130392544934215681618",
          "do_3130504860995420161742",
          "do_3130589210458357761163",
          "do_31305050192524902411033",
          "do_31306529528317542419435",
          "do_31306533191943782419026",
          "do_313066025867231232110294",
          "do_3130589156290560001402",
          "do_31307530718067916817037",
          "do_313005971877765120128",
          "do_31307533120910950416477",
          "do_31306531096720179217170",
          "do_31304900327385497611781",
          "do_313065297042546688113848",
          "do_313075284336787456110108",
          "do_31304900675143270411380",
          "do_31304838418811289611237",
          "do_31306533381743411218427",
          "do_313065278572060672113841",
          "do_313075222167666688110379",
          "do_3130632788031242241160",
          "do_31307530296175820816618",
          "do_3130390731865784321563",
          "do_31306538543316172819917",
          "do_3130390801545134081286",
          "do_313065321249800192112738",
          "do_3130151552819200001248",
          "do_31308384127012044811386",
          "do_3130589114507427841816",
          "do_313075199443247104110048",
          "do_31306528364842188817990",
          "do_31304838688654131211238",
          "do_31306605319997030418003",
          "do_31306532866500198419025",
          "do_31308384965314150412481",
          "do_313066023855947776110297",
          "do_31305894108781772811334",
          "do_31306532376206540819024",
          "do_31307526374409011219725",
          "do_313066070057402368114669",
          "do_313065290661937152112730",
          "do_3130589060590796801798",
          "do_3130589354983260161934",
          "do_3130589328301342721358",
          "do_31305893827548774411332",
          "do_31306547388126822419969",
          "do_31306534128391782417601",
          "do_313065475995222016114437",
          "do_313066147194077184110237",
          "do_3130504881268899841598",
          "do_31306532717308313619656",
          "do_31306531926992486419607",
          "do_3130589075654901761208",
          "do_31307531040059392017039",
          "do_313065314963267584114244",
          "do_31305049428314521611096",
          "do_31307520568296243216861",
          "do_3130589244069396481164",
          "do_3130504151271505921797",
          "do_31298616801946828815",
          "do_313011634730614784152",
          "do_313066049400717312110317",
          "do_313066018936807424110066",
          "do_31306532561743872019610",
          "do_3130589091988275201815",
          "do_313066031926034432110307",
          "do_3130504477923000321508",
          "do_3130504644407951361351",
          "do_3130589017205637121270",
          "do_31306614910436147218219",
          "do_313066071957135360114671",
          "do_313075299134586880110113",
          "do_31306533951892684819832",
          "do_31306534308709990419487",
          "do_31308674376934195212668",
          "do_31304899543648665611801",
          "do_312988843895422976120",
          "do_312995884651192320115",
          "do_31306530923647795217169",
          "do_31306528845746176018380",
          "do_31304839732087193611406",
          "do_31306531710631936019651",
          "do_31308525036421120012749",
          "do_31306533734160793619033",
          "do_313066021863063552114527",
          "do_31308384716541132811009",
          "do_3130589037513932801713",
          "do_31306527457474969619430",
          "do_3130588976769761281536",
          "do_313004464482959360136",
          "do_31298607686277529614",
          "do_3130151665311334401339",
          "do_312986085258543104119",
          "do_31306529259034214418426",
          "do_3129350207057920001115",
          "do_3130150271199477761361",
          "do_3130632715333468161247",
          "do_3130504663308779521586",
          "do_3130455636907786241472",
          "do_3130044619983994881271",
          "do_3129846730414080001170",
          "do_312968953053184000168",
          "do_3129719459474882561707",
          "do_312956926599536640117",
          "do_312995931616108544164",
          "do_3130045107563642881283",
          "do_312981028358873088110",
          "do_3130504827519303681306",
          "do_3129962030310686721147",
          "do_31298966900840857614",
          "do_3130632751624765441153",
          "do_3130504802180055041740",
          "do_3130270743777361921119",
          "do_31303628275397427211313",
          "do_3130194290390712321831",
          "do_31290742595521740812752"
        ];
        break;
      case 'tvProgram':
        filters.primaryCategory = ['TVLesson'];
        break;
      case 'home':
        this.router.navigateByUrl('/exploren?selectedTab=home')
        break;
      default: 
      filters.primaryCategory || ((_.get(filters, 'primaryCategory.length') && filters.primaryCategory) || _.get(this.allTabData, 'search.filters.primaryCategory'));
    }
    filters.mimeType = filters.mimeType || _.get(mimeType, 'values');
    _.forEach(_filters, (el, key) => {
      if (key !== 'primaryCategory' && key !== 'mimeType' && !_.has(filters, key)) {
        filters[key] = el;
      }
    });

    
    _.forEach(this.formData, (form, key) => {
      const pageTitle = _.get(this.resourceService, form.title);
      if (pageTitle && pageType && (pageTitle === pageType)) {
        filters.contentType = filters.contentType || _.get(form, 'search.filters.contentType');
      }
    });
    const softConstraints = _.get(this.activatedRoute.snapshot, 'data.softConstraints') || {};
    if (this.queryParams.key) {
      delete softConstraints['board'];
    }
    const option: any = {
      filters: _.omitBy(filters || {}, value => _.isArray(value) ? (!_.get(value, 'length') ? true : false) : false),
      fields: _.get(this.allTabData, 'search.fields'),
      limit: _.get(this.allTabData, 'search.limit') ?  _.get(this.allTabData, 'search.limit')
      : this.configService.appConfig.SEARCH.PAGE_LIMIT,
      pageNumber: this.paginationDetails.currentPage,
      query: this.queryParams.key,
      sort_by: {lastPublishedOn: 'desc'},
      mode: 'soft',
      softConstraints: softConstraints,
      facets: this.globalSearchFacets,
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams || {}
    };
    _.filter(Object.keys(this.queryParams),filterValue => { 
      if(((_.get(this.allTabData , 'search.facets').indexOf(filterValue) !== -1)))
      {
          option.filters[filterValue] = (typeof(this.queryParams[filterValue]) === "string" ) ? this.queryParams[filterValue].split(',') : this.queryParams[filterValue];

      }
  });
    if (this.queryParams.softConstraints) {
      try {
        option.softConstraints = JSON.parse(this.queryParams.softConstraints);
      } catch {

      }
    }
    if (this.frameworkId) {
      option.params.framework = this.frameworkId;
    }
    // Replacing cbse/ncert value with cbse
    console.log("Se boards present ", filters);
    const cbseNcertExists = [_.get(filters, 'board[0]'), _.get(filters, 'board'), _.get(filters, 'se_boards[0]'), _.get(filters, 'se_boards')].some(board => _.toLower(board) === 'cbse/ncert');
    // if (cbseNcertExists) {
    //   option.filters.se_boards = ['CBSE'];
    // }
    option.filters.primaryCategory = this.selectedFilters.primaryCategory && this.selectedFilters.primaryCategory.length ? this.selectedFilters.primaryCategory : filters.primaryCategory;
    console.log("Options before API", option);
    this.searchService.contentSearch(option)
      .pipe(
        mergeMap(data => {
        //   const { subject: selectedSubjects = [] } = (this.selectedFilters || {}) as { subject: [] };
        //   const filteredContents = omit(groupBy(get(data, 'result.content') || get(data, 'result.QuestionSet'), content => {
        //     return ((this.queryParams['primaryCategory'] && this.queryParams['primaryCategory'].length > 0) ? content['subject'] : content['primaryCategory']);
        // }), ['undefined']);
        // for (const [key, value] of Object.entries(filteredContents)) {
        //     const isMultipleSubjects = key && key.split(',').length > 1;
        //     if (isMultipleSubjects) {
        //         const subjects = key && key.split(',');
        //         subjects.forEach((subject) => {
        //             if (filteredContents[subject]) {
        //                 filteredContents[subject] = uniqBy(filteredContents[subject].concat(value), 'identifier');
        //             } else {
        //                 filteredContents[subject] = value;
        //             }
        //         });
        //         delete filteredContents[key];
        //     }
        // }
       // const sections = [];
        // for (const section in filteredContents) {
        //     if (section) {
        //         if (selectedSubjects.length && !(find(selectedSubjects, selectedSub => toLower(selectedSub) === toLower(section)))) {
        //             continue;
        //         }
        //         sections.push({
        //             name: section,
        //             contents: filteredContents[section]
        //         });
        //     }
        // }
        // _map(sections, (section) => {
        //     forEach(section.contents, contents => {
        //         contents.cardImg = contents.appIcon || 'assets/images/book.png';
        //     });
        //     return section;
        // });
        //this.contentList = sections;
        if(get(data, 'result.content') && get(data, 'result.QuestionSet')){
          this.contentList = _.concat(get(data, 'result.content'), get(data, 'result.QuestionSet'));
        } else if(get(data, 'result.content')){
          this.contentList = get(data, 'result.content');
        } else {
          this.contentList = get(data, 'result.QuestionSet');
        }
        this.addHoverData();
          const channelFacet = _.find(_.get(data, 'result.facets') || [], facet => _.get(facet, 'name') === 'channel');
          if (channelFacet) {
            const rootOrgIds = this.orgDetailsService.processOrgData(_.get(channelFacet, 'values'));
            return this.orgDetailsService.searchOrgDetails({
              filters: { isTenant: true, id: rootOrgIds },
              fields: ['slug', 'identifier', 'orgName']
            }).pipe(
              mergeMap(orgDetails => {
                channelFacet.values = _.get(orgDetails, 'content');
                return of(data);
              })
            );
          }
          return of(data);
        })
      )
      .subscribe(data => {
        this.showLoader = false;
        this.facets = this.searchService.updateFacetsData(_.get(data, 'result.facets'));
        this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.totalCount = data.result.count;
        this.setNoResultMessage();
      }, err => {
        this.showLoader = false;
        this.contentList = [];
        this.facetsList = [];
        this.totalCount = 0;
        this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
  }
  addHoverData() {
    this.contentList = this.utilService.addHoverData(this.contentList, true);  
  }
  moveToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    const url = this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString());
    this.router.navigate([url], { queryParams: this.queryParams });
    this.moveToTop();
  }
  private setTelemetryData() {
    this.inViewLogs = []; // set to empty every time filter or page changes
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    this.cardIntractEdata = {
      id: 'content-card',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  public playContent(event) {
    this.publicPlayerService.playContent(event);
  }
  public inView(event) {
    _.forEach(event.inview, (elem, key) => {
      const obj = _.find(this.inViewLogs, { objid: elem.data.identifier });
      if (!obj) {
        this.inViewLogs.push({
          objid: elem.data.identifier,
          objtype: elem.data.contentType || 'content',
          index: elem.id
        });
      }
    });

    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private listenLanguageChange() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
      this.setNoResultMessage();
      if (_.get(this.contentList, 'length') ) {
        if (this.isDesktopApp) {
          this.addHoverData();
        }
        this.facets = this.searchService.updateFacetsData(this.facets);
      }
    });
  }

  private setNoResultMessage() {
    this.resourceService.languageSelected$.subscribe(item => {
    let title = this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noBookfoundTitle'), 'frmelmnts.lbl.noBookfoundTitle', get(item, 'value'));    
    if (this.queryParams.key) {
      const title_part1 = _.replace(this.resourceService.frmelmnts.lbl.desktop.yourSearch, '{key}', this.queryParams.key);
      const title_part2 = this.resourceService.frmelmnts.lbl.desktop.notMatchContent;
      title = title_part1 + ' ' + title_part2;
    }
      this.noResultMessage = {
        'title': title,
        'subTitle': this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noBookfoundSubTitle'), 'frmelmnts.lbl.noBookfoundSubTitle', get(item, 'value')),
        'buttonText': this.utilService.transposeTerms(get(this.resourceService, 'frmelmnts.lbl.noBookfoundButtonText'), 'frmelmnts.lbl.noBookfoundButtonText', get(item, 'value')),
        'showExploreContentButton': false
      };
      
    });
    
  }

  updateCardData(downloadListdata) {
    _.each(this.contentList, (contents) => {
      this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
  }

  hoverActionClicked(event) {
    event['data'] = event.content;
    this.contentName = event.content.name;
    this.contentData = event.data;
    let telemetryButtonId: any;
    switch (event.hover.type.toUpperCase()) {
      case 'OPEN':
        this.playContent(event);
        this.logTelemetry(this.contentData, 'play-content');
        break;
      case 'DOWNLOAD':
        this.downloadIdentifier = _.get(event, 'content.identifier');
        this.showModal = this.offlineCardService.isYoutubeContent(this.contentData);
        if (!this.showModal) {
          this.showDownloadLoader = true;
          this.downloadContent(this.downloadIdentifier);
        }
        telemetryButtonId = this.contentData.mimeType ===
          'application/vnd.ekstep.content-collection' ? 'download-collection' : 'download-content';
        this.logTelemetry(this.contentData, telemetryButtonId);
        break;
    }
  }

  callDownload() {
    this.showDownloadLoader = true;
    this.downloadContent(this.downloadIdentifier);
  }

  downloadContent(contentId) {
    this.contentManagerService.downloadContentId = contentId;
    this.contentManagerService.downloadContentData = this.contentData;
    this.contentManagerService.failedContentName = this.contentName;
    this.contentManagerService.startDownload({})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.downloadIdentifier = '';
        this.contentManagerService.downloadContentId = '';
        this.contentManagerService.downloadContentData = {};
        this.contentManagerService.failedContentName = '';
        this.showDownloadLoader = false;
      }, error => {
        this.downloadIdentifier = '';
        this.contentManagerService.downloadContentId = '';
        this.contentManagerService.downloadContentData = {};
        this.contentManagerService.failedContentName = '';
        this.showDownloadLoader = false;
        _.each(this.contentList, (content) => {
          content['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
        });
        if (!(error.error.params.err === 'LOW_DISK_SPACE')) {
          this.toasterService.error(this.resourceService.messages.fmsg.m0090);
        }
      });
  }

logTelemetry(content, actionId) {
    const telemetryInteractObject = {
      id: content.identifier,
      type: content.contentType,
      ver: content.pkgVersion ? content.pkgVersion.toString() : '1.0'
    };

    const appTelemetryInteractData: any = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
          _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
          _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env')
      },
      edata: {
        id: actionId,
        type: 'click',
        pageid: this.router.url.split('/')[1] || 'explore-page'
      }
    };

    if (telemetryInteractObject) {
      if (telemetryInteractObject.ver) {
        telemetryInteractObject.ver = _.isNumber(telemetryInteractObject.ver) ?
          _.toString(telemetryInteractObject.ver) : telemetryInteractObject.ver;
      }
      appTelemetryInteractData.object = telemetryInteractObject;
    }
    this.telemetryService.interact(appTelemetryInteractData);
  }
  public viewAll(event) {
    this.moveToTop();
    this.logViewAllTelemetry(event);
    const searchQueryParams: any = {};
    searchQueryParams.defaultSortBy = JSON.stringify({ lastPublishedOn: 'desc' });
    searchQueryParams['exists'] = undefined;
    searchQueryParams['primaryCategory'] = (this.queryParams.primaryCategory && this.queryParams.primaryCategory.length) ?
     this.queryParams.primaryCategory : [event.name];
    (this.queryParams.primaryCategory && this.queryParams.primaryCategory.length) ? (searchQueryParams['subject'] = [event.name]) :
    (searchQueryParams['se_subjects'] = this.queryParams.se_subjects);
    searchQueryParams['selectedTab'] = this.queryParams.selectedTab;
    if (this.queryParams.channel) {
      searchQueryParams['channel'] = this.queryParams.channel;
    }
    searchQueryParams['visibility'] = [];
    searchQueryParams['appliedFilters'] = true;
    const sectionUrl = '/explore' + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], { queryParams: searchQueryParams, state: {} });
 }

 public isUserLoggedIn(): boolean {
  return this.userService && (this.userService.loggedIn || false);
}

logViewAllTelemetry(event) {
  const telemetryData = {
      cdata: [{
          type: 'section',
          id: event.name
      }],
      edata: {
          id: 'view-all'
      }
  };
  this.getInteractEdata(telemetryData);
}

getInteractEdata(event) {
  const cardClickInteractData = {
      context: {
          cdata: event.cdata,
          env: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
          id: get(event, 'edata.id'),
          type: 'click',
          pageid: this.isUserLoggedIn() ? 'library' : this.activatedRoute.snapshot.data.telemetry.pageid
      },
      object: get(event, 'object')
  };
  this.telemetryService.interact(cardClickInteractData);
}
}

