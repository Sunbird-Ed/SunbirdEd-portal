import { IGeoJSON } from '../../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

interface IFeatureProperty {
  name: string;
  identifier: string;
  data: { [key: string]: any }[]
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  public addPropertiesToGeoJSON(geoJSONCollection: IGeoJSON, properties: IFeatureProperty[], hardFilter = false) {
    const { type, features } = _.cloneDeep(geoJSONCollection) as IGeoJSON;
    const filteredFeatures = [];
    properties.forEach(prop => {
      const { name, identifier = [], data = [] } = prop;
      const [key, value] = identifier as [string, string];
      let featureObj = features.find(feature => {
        const { properties = {} } = feature;
        return key && value && properties[key] === value.toLowerCase();
      });

      if (featureObj) {
        featureObj['metaData'] = prop;
        featureObj.properties = {
          ...(featureObj.properties || {}),
          ...data.reduce((acc, metric) => ({ ...acc, ...metric }), {})
        };
      }
      
      filteredFeatures.push(featureObj);
    });
    return { type, features: hardFilter ? filteredFeatures : features };
  }
}
