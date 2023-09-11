import { ToasterService } from '@sunbird/shared';
import { ReportService } from '../../services';
import { IGeoJSON, ICustomMapObj, Properties, IInputMapData } from '../../interfaces';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Map } from 'leaflet';
import { of, throwError, zip, BehaviorSubject } from 'rxjs';
import { mergeMap, map, retry, catchError, skipWhile, pluck, tap } from 'rxjs/operators';
import * as mappingConfig from '../../config/nameToCodeMapping.json';
import { cloneDeep, toLower, find, random, groupBy, reduce } from 'lodash-es';


declare var L;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  public mapId;
  private map: Map;
  private geoJSONRootLayer;
  private infoControl;
  public subscription$;
  private getGeoJSON = new BehaviorSubject(undefined);
  @Output() featureClicked = new EventEmitter();
  private mappingConfig: any;
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
  };

  private __mapData = {
    folder: 'geoJSONFiles',
    strict: true
  };

  private __options = Object.assign(this.__defaultConfig);

  @Input() set options(options) {
    this.__options = {
      ...this.__defaultConfig,
      ...options
    };
  }

  @Input() set mapData(data) {
    this.__mapData = {
      ...this.__mapData,
      ...data
    };
    this.getGeoJSON.next(this.__mapData);
  }

  constructor(private toasterService: ToasterService, private reportService: ReportService) {
    this.mappingConfig = (<any>mappingConfig);
    this.mapId = `map-${random(0, 1000)}`;
  }

  private getLayer(data?: IGeoJSON) {
    return L && L.geoJSON(data || null, {
      style: this.setStyle.bind(this),
      onEachFeature: this.onEachFeature.bind(this)
    });
  }

  /**
   * @description sets the initial coordinates, zoom level & boundaries for the leaflet Map
   * @private
   * @memberof Map2Component
   */
  private setInitialMapView() {
    const { initialCoordinate, initialZoomLevel, latBounds, lonBounds } = this.__options;
    this.map = L && L.map(this.mapId).setView(initialCoordinate, initialZoomLevel);
    this.geoJSONRootLayer = this.map && this.getLayer().addTo(this.map);
    const maxBounds = L && L.latLngBounds([latBounds, lonBounds]);
    if (this.map) {
      this.map.setMaxBounds(maxBounds);
      this.map.fitBounds(maxBounds);
    }
  }

  /**
   * @description click handler for a specfic layer within the map
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private clickHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    console.log({ ...properties, ...metaData });
    this.featureClicked.emit({ ...metaData, ...properties });
  }

  /**
   * @description handles mouse out event for a specific layer
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private mouseoutHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    this.geoJSONRootLayer.resetStyle(event.target);
  }

  /**
   * @description mouseover event handler
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private mouseoverHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    const layer = event.target;
    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8
    });
    if (L && (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)) {
      layer.bringToFront();
    }
    this.infoControl && this.infoControl.update(properties);
    const mergedObj = { ...properties, ...metaData };
    layer.bindPopup(mergedObj.name || 'Unknown').openPopup();
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
    // const center = layer.getBounds().getCenter();
    // L.marker(center).addTo(this.map);
    layer.on({
      mouseover: this.mouseoverHandler.bind(this, { properties, metaData }),
      mouseout: this.mouseoutHandler.bind(this, { properties, metaData }),
      click: this.clickHandler.bind(this, { properties, metaData })
    });
  }

  private setControl() {
    const { controlTitle } = this.__options;
    const infoControl = this.infoControl = L && L.control();
    infoControl.onAdd = function (map) {
      this._div = L && L.DomUtil.create('div', 'infoControl');
      this.update();
      return this._div;
    };
    infoControl.update = function (properties = {}) {
      const text = Object.entries(properties).map(([key, value]) => `<br />${key}: ${value}`).join('<br />');
      this._div.innerHTML = `<h4>${controlTitle}</h4>
      ${text}`;
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
    L && this.map && L.tileLayer(urlTemplate, options).addTo(this.map);
  }
  /**
   * @description dynamically add custom properties from external JSON to feature Objects
   * @private
   * @param {*} { reportData = [], layers = [], labelExpr = 'District', type = 'district', features = [], metrics = [] }
   * @returns
   * @memberof MapComponent
   */
  private addProperties({ reportData = [], layers = [], labelExpr = 'District', type = 'district', features = [], metrics = [] }) {
    const filteredFeatures = [];
    const datasets = groupBy(reportData || [], data => toLower(data[labelExpr]));
    layers.forEach(layer => {
      const recordFromConfigMapping = this.findRecordInConfigMapping({ type, name: layer });
      const dataset = datasets.hasOwnProperty(toLower(layer)) && datasets[toLower(layer)];
      const featureObj = features.find(feature => {
        const { properties = {} } = feature;
        return recordFromConfigMapping && +properties.code === +recordFromConfigMapping.code;
      });
      if (!recordFromConfigMapping || !dataset || !featureObj) { return; }
      featureObj['metaData'] = { name: layer };
      const result = reduce(dataset, (accumulator, value) => {
        metrics.forEach(metric => {
          accumulator[metric] = (accumulator[metric] || 0) + (+value[metric]);
        });
        return accumulator;
      }, {});
      featureObj.properties = {
        ...(featureObj.properties || {}),
        ...(result || {})
      };
      filteredFeatures.push(featureObj);
    });
    return filteredFeatures;
  }

  private dataHandler() {
    return this.getGeoJSON.pipe(
      skipWhile(input => input === undefined || input === null || !(input.hasOwnProperty('state') || input.hasOwnProperty('country'))),
      mergeMap((input: IInputMapData) => {
        const { country = null, states = [], state, districts = [], metrics = [], labelExpr = 'District', strict = false, folder } = input;
        let paramter;
        if (country) {
          paramter = { type: 'country', name: country };
        } else {
          paramter = { type: 'state', name: state };
        }
        const { geoJSONFilename = null } = this.findRecordInConfigMapping(paramter) || {};
        if (!geoJSONFilename) {
          return throwError('specified geoJSON file not found');
        }
        return zip(this.getGeoJSONFile({ fileName: geoJSONFilename, folder }), this.getDataSourceData())
          .pipe(
            map(([geoJSONData, reportData]) => {
              const { type, features = [] } = cloneDeep(geoJSONData) as IGeoJSON;
              let filteredFeatures;
              if (country && states.length) {
                filteredFeatures = this.addProperties({ reportData, layers: states, labelExpr, type: 'state', features, metrics });
              } else {
                filteredFeatures = this.addProperties({ reportData, layers: districts, labelExpr, type: 'district', features, metrics });
              }
              return { type, features: strict ? filteredFeatures : features };
            })
          );
      }),
      tap(response => {
        if (this.geoJSONRootLayer && this.map && response) {
          this.geoJSONRootLayer.addData(response);
          if(this.geoJSONRootLayer.getBounds())
            this.map.fitBounds(this.geoJSONRootLayer.getBounds());
        }
      }, err => {
        console.error(err);
        const { errorText = 'Failed to render Map' } = err;
        this.toasterService.error(errorText);
      }),
      catchError(err => {
        return of(null);
      })
    );
  }

  ngOnInit() {
    this.subscription$ = this.dataHandler();
  }

  ngAfterViewInit() {
    this.setInitialMapView();
    this.addTileLayer();
    this.setControl();
  }

  private findRecordInConfigMapping({ type = null, name = null, code = null }) {
    return find(this.mappingConfig, config => {
      const { type: configType, name: configName, code: configCode } = config;
      if (code) { return configCode === code; }
      return configType && configName && toLower(configType) === toLower(type) && toLower(configName) === toLower(name);
    });
  }

  private getGeoJSONFile({ folder = 'geoJSONFiles', fileName }: Record<string, string>) {
    return this.reportService.fetchDataSource(`/reports/fetch/${folder}/${fileName}`)
      .pipe(
        pluck('result'),
        retry(2),
        catchError(err => throwError({ errorText: 'Failed to download geoJSON file.' }))
      );
  }

  private getDataSourceData() {
    const { reportLoc, reportData } = this.__mapData as IInputMapData;
    if (reportData) { return of(reportData); }
    return this.reportService.fetchDataSource(reportLoc)
      .pipe(
        pluck('result'),
        pluck('data'),
        retry(2),
        catchError(err => throwError({ errorText: 'Failed to download dataSource file.' }))
      );
  }

}
