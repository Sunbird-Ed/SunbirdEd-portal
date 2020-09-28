import { ToasterService } from '@sunbird/shared';
import { ReportService } from '../../services';
import { IGeoJSON, ICustomMapObj, Properties, IInputMapData } from '../../interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Map } from 'leaflet';
import { of, throwError, iif, zip, BehaviorSubject } from 'rxjs';
import { mergeMap, map, retry, catchError, skipWhile, pluck } from 'rxjs/operators';
import * as mappingConfig from '../../config/nameToCodeMapping.json';
import { cloneDeep, toLower, find, get, compact, pick } from 'lodash-es';


declare var L;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map: Map;
  private geoJSONRootLayer;
  private infoControl;
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
  }

  private __mapData = {
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
    this.getGeoJSON.next(this.__mapData);
  }

  constructor(private toasterService: ToasterService, private reportService: ReportService) {
    this.mappingConfig = (<any>mappingConfig.default);
  }

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
  private clickHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    this.map.fitBounds(event.target.getBounds());
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
    layer.bindPopup(mergedObj[metaData.labelField] || mergedObj.district || mergedObj.st_nm || mergedObj.name || 'Unknown').openPopup();
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

  private subscribeToRenderer() {
    this.getGeoJSON.pipe(
      skipWhile(input => input === undefined || input === null),
      mergeMap((input: IInputMapData) => {
        const { state, districts = [], metrics = [], labelExpr = "District", strict = false, folder } = input;
        const { geoJSONFilename = null } = this.findRecordInConfigMapping({ type: "state", name: state }) || {};
        if (!geoJSONFilename) {
          return throwError('specified geoJSON file not found');
        }
        return zip(this.getGeoJSONFile({ fileName: geoJSONFilename, folder }), this.getDataSourceData())
          .pipe(
            map(([geoJSONData, reportData]) => {
              const { type, features } = cloneDeep(geoJSONData) as IGeoJSON;
              const filteredFeatures = [];
              districts.forEach(district => {
                const districtObj = this.findRecordInConfigMapping({ type: 'district', name: district });
                
                const dis = find(reportData || [], data => toLower(data[labelExpr]) === toLower(district));
                
                const featureObj = features.find(feature => {
                  const { properties = {} } = feature;
                  return districtObj && properties.district === district;
                });

                if (!districtObj || !dis || !featureObj) return;
                featureObj['metaData'] = { name: district };
                const metricsObject = pick(dis, metrics);
                featureObj.properties = {
                  ...(featureObj.properties || {}),
                  ...metricsObject
                }
                filteredFeatures.push(featureObj);
              });
              return { type, features: strict ? filteredFeatures : features };
            })
          )
      })
    ).subscribe(res => {
      this.geoJSONRootLayer.addData(res);
      this.map.fitBounds(this.geoJSONRootLayer.getBounds());
    }, err => {
      console.error(err);
      const { errorText = 'Failed to render Map' } = err;
      this.toasterService.error(errorText);
    })
  }

  ngOnInit() {
    this.setInitialMapView();
    this.addTileLayer();
    this.setControl();
    this.subscribeToRenderer();
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

  public findRecordInConfigMapping({ type, name, code = null }) {
    return find(this.mappingConfig, config => {
      const { type: configType, name: configName, code: configCode } = config;
      if (code) return configType === code;
      return configType && configName && toLower(configType) === toLower(type) && toLower(configName) === toLower(name);
    })
  }

  public getGeoJSONFile({ folder = "geoJSON-sample", fileName }: Record<string, string>) {
    return this.reportService.fetchDataSource(`/reports/fetch/${folder}/${fileName}`)
      .pipe(
        pluck('result'),
        retry(2),
        catchError(err => throwError({ errorText: 'Failed to download geoJSON file.' }))
      )
  }

  private getDataSourceData() {
    const { reportLoc, reportData } = this.__mapData as IInputMapData;
    if (reportData) return of(reportData);
    return this.reportService.fetchDataSource(reportLoc)
      .pipe(
        pluck('result'),
        pluck('data'),
        retry(2),
        catchError(err => throwError({ errorText: 'Failed to download dataSource file.' }))
      );
  }

}