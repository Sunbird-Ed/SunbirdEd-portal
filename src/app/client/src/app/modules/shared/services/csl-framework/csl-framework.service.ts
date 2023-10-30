import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CslFrameworkService {
  // frameworkCat: any = {
  //   "fwCategory1": {
  //     "code": "foodcrops",
  //     "identifier": "fwCategory1",
  //     "label": "Foodcrops",
  //     "placeHolder": "Select Foodcrops",
  //     "index": 1,
  //     "translation": "{\"en\":\"Foodcrops\"}"
  //   },
  //   "fwCategory2": {
  //     "code": "commercialcrops",
  //     "identifier": "fw_category_2",
  //     "label": "CommercialCrops",
  //     "index": 2,
  //     "translation": "{\"en\":\"Commercial Crops\"}"
  //   },
  //   "fwCategory3": {
  //     "code": "livestockmanagement",
  //     "identifier": "fw_category_3",
  //     "label": "Live Stock Management",
  //     "index": 3,
  //     "translation": "{\"en\":\"Live Stock Management\"}"
  //   },
  //   "fwCategory4": {
  //     "code": "livestockspecies",
  //     "identifier": "fw_category_4",
  //     "label": "Live Stock Species",
  //     "index": 4,
  //     "translation": "{\"en\":\"Live Stock Species\"}"
  //   },
  //   "fwCategory5": {
  //     "code": "animalwelfare",
  //     "identifier": "fw_category_4",
  //     "label": "Animal Welfare",
  //     "index": 5,
  //     "translation": "{\"en\":\"Animal Welfare\"}"
  //   }

  // }
  // frameworkCatValues: any = [
  //   {
  //     "code": "foodcrops",
  //     "identifier": "fwCategory1",
  //     "label": "Foodcrops",
  //     "placeHolder": "Select Foodcrops",
  //     "index": 1,
  //     "translation": "{\"en\":\"Foodcrops\"}"
  //   },
  //   {
  //     "code": "commercialcrops",
  //     "identifier": "fw_category_2",
  //     "label": "CommercialCrops",
  //     "index": 2,
  //     "translation": "{\"en\":\"Commercial Crops\"}"
  //   },
  //   {
  //     "code": "livestockmanagement",
  //     "identifier": "fw_category_3",
  //     "label": "Live StockManagement",
  //     "index": 3,
  //     "translation": "{\"en\":\"Live Stock Management\"}"
  //   },
  //   {
  //     "code": "livestockspecies",
  //     "identifier": "fw_category_4",
  //     "label": "Live Stock Species",
  //     "index": 4,
  //     "translation": "{\"en\":\"Live Stock Species\"}"
  //   },
  //   {
  //     "code": "animalwelfare",
  //     "identifier": "fw_category_4",
  //     "label": "Animal Welfare",
  //     "index": 5,
  //     "translation": "{\"en\":\"Animal Welfare\"}"
  //   }]

  //BMGS

  frameworkCat: any = {
    "fwCategory1": {
      "code": "board",
      "identifier": "fwCategory1",
      "label": "Board",
      "placeHolder": "Select board",
      "index": 1,
      "translation": "{\"en\":\"board\"}"
    },
    "fwCategory2": {
      "code": "medium",
      "identifier": "fw_category_2",
      "label": "Medium",
      "index": 2,
      "translation": "{\"en\":\"Medium\"}"
    },
    "fwCategory3": {
      "code": "gradeLevel",
      "identifier": "fw_category_3",
      "label": "GradeLevel",
      "index": 3,
      "translation": "{\"en\":\"GradeLevel\"}"
    },
    "fwCategory4": {
      "code": "subject",
      "identifier": "fw_category_4",
      "label": "Subject",
      "index": 4,
      "translation": "{\"en\":\"Subject\"}"
    }

  }
  frameworkCatValues: any = [
  {
      "code": "board",
      "identifier": "fwCategory1",
      "label": "Board",
      "placeHolder": "Select board",
      "index": 1,
      "translation": "{\"en\":\"board\"}"
    },
    {
      "code": "medium",
      "identifier": "fw_category_2",
      "label": "Medium",
      "index": 2,
      "translation": "{\"en\":\"Medium\"}"
    },
  {
      "code": "gradeLevel",
      "identifier": "fw_category_3",
      "label": "GradeLevel",
      "index": 3,
      "translation": "{\"en\":\"GradeLevel\"}"
    },
   {
      "code": "subject",
      "identifier": "fw_category_4",
      "label": "Subject",
      "index": 4,
      "translation": "{\"en\":\"Subject\"}"
    }
  ]

  constructor() { }

  frameworkLabelTransform(userDefinedFwCategory, userPrefernce) {
    let resArray: any = [];
    userDefinedFwCategory.forEach(field => {
      if (userPrefernce.framework[field.code] && userPrefernce.framework[field.code][0]) {
        let data = {
          labels: field.label,
          values: userPrefernce.framework[field.code]
        }
        resArray.push(data)
      }
    })
    return resArray
  }
  //to set the framework cat in localstorage
  public setFrameworkCategories() {
    localStorage.setItem('fwCategoryObject', JSON.stringify(this.frameworkCat))
  }
  public getFrameworkCategories() {
    return JSON.parse(localStorage.getItem('fwCategoryObject'));
  }
  public setFrameworkCategoriesObject() {
    localStorage.setItem('fwCategoryObjectValues', JSON.stringify(this.frameworkCatValues))
  }
  public getFrameworkCategoriesObject() {
    return JSON.parse(localStorage.getItem('fwCategoryObjectValues'));
  }

}
