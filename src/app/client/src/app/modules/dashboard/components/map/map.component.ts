import { ToasterService } from '@sunbird/shared';
import { MapService, ReportService } from '../../services';
import { IGeoJSON } from '../../interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Map } from 'leaflet';
import { Subject, of } from 'rxjs';
import { switchMap, map, retry, catchError, startWith, pluck } from 'rxjs/operators';

declare var L;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private readonly __defaultConfig = {
    initialCoordinate: [20, 78],
    latBounds: [6.4626999, 68.1097],
    lonBounds: [35.513327, 97.39535869999999],
    initialZoomLevel: 5,
    controlTitle: 'India Heat Map',
    tileLayer: {
      urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    rootStyle: {
      fillColor: '#007cbe',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      cursor: 'no-drop'
    }
  }

  private __mapData = {
    fileName: "india.json",
    states: [],
    folder: "geoJSON-sample",
    strict: false
  };

  private __options = Object.assign(this.__defaultConfig);

  @Input() set options(options) {
    this.__options = {
      ...this.__defaultConfig,
      ...options
    }
  }

  @Input() set mapData(data) {
    this.__mapData = {
      ...this.__mapData,
      ...data
    }
    this.getGeoJSON.next({ file: this.__mapData.fileName, properties: this.__mapData.states })
  }

  private map: Map;
  private geoJSONRootLayer;
  private infoControl;
  private getGeoJSON = new Subject();
  @Output() featureClicked = new EventEmitter();

  constructor(private mapService: MapService, private toasterService: ToasterService,
    private reportService: ReportService) { }

  private getLayer(data?: IGeoJSON) {
    return L.geoJSON(data || null, {
      style: this.setStyle.bind(this),
      onEachFeature: this.onEachFeature.bind(this)
    })
  }

  /**
   * @description sets the initial coordinates, zoom level & boundaries for the leaflet Map
   * @private
   * @memberof Map2Component
   */
  private setInitialMapView() {
    const { initialCoordinate, initialZoomLevel, latBounds, lonBounds } = this.__options;
    this.map = L.map('mapid').setView(initialCoordinate, initialZoomLevel);
    this.geoJSONRootLayer = this.getLayer().addTo(this.map);
    const maxBounds = L.latLngBounds([latBounds, lonBounds]);
    this.map.setMaxBounds(maxBounds);
    this.map.fitBounds(maxBounds);
  }

  /**
   * @description click handler for a specfic layer within the map
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private clickHandler({ properties, metaData }, event) {
    const { fileName, districts = [], drillDown = false, fitBounds = false } = metaData;
    if (fitBounds) {
      this.map.fitBounds(event.target.getBounds());
    }
    if (drillDown && fileName) {
      this.getGeoJSON.next({ file: fileName, properties: districts })
    }
    this.featureClicked.emit({ ...metaData, ...properties });
  }

  /**
   * @description handles mouse out event for a specific layer
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private mouseoutHandler({ properties, metaData }, event) {
    this.geoJSONRootLayer.resetStyle(event.target);
  }

  /**
   * @description mouseover event handler
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private mouseoverHandler({ properties, metaData }, event) {
    var layer = event.target;
    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    this.infoControl.update(properties);
    const mergedObj = { ...properties, ...metaData };
    layer.bindPopup(mergedObj.labelField || mergedObj.district || mergedObj.st_nm || mergedObj.name).openPopup();
  }

  /**
   * @description attaches event handlers on each layer
   * @private
   * @param {*} feature
   * @param {*} layer
   * @memberof Map2Component
   */
  private onEachFeature(feature, layer) {
    const { properties, metaData = {} } = feature;
    this.hideLayers();
    layer.on({
      mouseover: this.mouseoverHandler.bind(this, { properties, metaData }),
      mouseout: this.mouseoutHandler.bind(this, { properties, metaData }),
      click: this.clickHandler.bind(this, { properties, metaData })
    });

  }

  private setControl() {
    const { controlTitle } = this.__options;
    let infoControl = this.infoControl = L.control();
    infoControl.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'infoControl');
      this.update();
      return this._div;
    };
    infoControl.update = function (properties = {}) {
      const text = Object.entries(properties).map(([key, value]) => `<br />${key}: ${value}`).join('<br />');
      this._div.innerHTML = `<h4>${controlTitle}</h4>
      ${text}`
    };
    infoControl.addTo(this.map);
  }

  /**
   * @description sets styles for each feature layer
   * @private
   * @param {*} feature
   * @returns
   * @memberof MapComponent
   */
  private setStyle(feature, layer) {
    const { metaData = {} } = feature;
    return {
      ...this.__options.rootStyle, ...(!metaData.drillDown && !metaData.fileName &&
        { className: 'notAllowedCursor' })
    };
  }

  private addTileLayer() {
    const { urlTemplate, options } = this.__options.tileLayer;
    L.tileLayer(urlTemplate, options).addTo(this.map);
  }

  private setGeoJSONData() {
    this.getGeoJSON
      .pipe(
        startWith({ file: this.__mapData.fileName, properties: this.__mapData.states }),
        switchMap((input: any) => {
          return this.reportService.fetchDataSource(`/reports/fetch/${this.__mapData.folder}/${input.file}`)
            .pipe(
              pluck('result'),
              map((geoJSON: any) => this.mapService.addPropertiesToGeoJSON(geoJSON, input.properties || [],
                this.__mapData.strict || false)),
              retry(5),
              catchError(err => {
                this.toasterService.warning('Failed to download geoJSON file');
                return of({});
              })
            )
        })
      ).subscribe(res => {
        this.geoJSONRootLayer.addData(res);
      }, err => {
        console.error(err);
      })
  }

  ngOnInit() {
    this.setInitialMapView();
    this.addTileLayer();
    this.setControl();
    this.setGeoJSONData();
  }
  /**
   * @description hide a particular state or district etc layer from the map by passing a hide key in the config
   * @private
   * @memberof Map2Component
   */
  private hideLayers() {
    this.geoJSONRootLayer.eachLayer((layer) => {
      const { properties = {}, metaData = {} } = layer.feature;
      if (properties.hide || metaData.hide) {
        this.map.removeLayer(layer);
      }
    });
  }

}
