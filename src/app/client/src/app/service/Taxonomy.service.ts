// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaxonomyCategories } from './../framework.config';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor() { }

  getTaxonomyCategories(){
    return TaxonomyCategories;
  }

}