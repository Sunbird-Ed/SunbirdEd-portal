import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./global.service";
export class UciGraphQlService extends BaseService {
    constructor(http, globalService) {
        super(http, globalService);
        this.http = http;
        this.globalService = globalService;
        this.globalService.baseUrl$.subscribe(value => {
            if (value) {
                this.BASE_URL = value + '/v1/graphql';
            }
        });
    }
    getState() {
        return this.baseRequest({
            query: `query getListOfStates{
            organisation(distinct_on:state){
            state}}`
        });
    }
    getDistrict(param) {
        return this.baseRequest({
            query: `query getListOfDistrictInState($state:String){
            organisation(where:{state:{_eq:$state}},  distinct_on:district){
            state
            district}}`,
            variables: param
        });
    }
    getBlock(param) {
        return this.baseRequest({
            query: `query getListOfBlocksUnderDistrict($district:[String!],$state:String){
            blocks: organisation(where:{state:{_eq:$state},district:{_in:$district}},distinct_on:block){
            block
            district
            state
            }
            }`,
            variables: param
        });
    }
    getSchoolDetails(param) {
        return this.baseRequest({
            query: `query getListOfSchoolsUnderBlocksAndDistrict($district:[String!],$state:String,$block:[String!]){
            schools:organisation(where:{state:{_eq:$state},district:{_in:$district},block:{_in:$block}}){
            school
            school_code
            block
            district
            state
            }
            }`,
            variables: param
        });
    }
    getClusters(param) {
        return this.baseRequest({
            query: `query getListOfClustersUnderBlockAndDistrict($block:[String!],$district:[String!],$state:String){
            clusters:organisation(where:{state:{_eq:$state},district:{_in:$district},block:{_in:$block}},distinct_on:cluster){
            cluster
            }
            }`,
            variables: param
        });
    }
    getRole() {
        return this.baseRequest({
            query: `query fetchListOfRoles{
                   role{
                   id
                   name
                   }
                   }`
        });
    }
    getBoards() {
        return this.baseRequest({
            query: `query listOfBoards{
                  board{
                  id
                  name}}`
        });
    }
    baseRequest(body) {
        return this.http.post(this.BASE_URL, body, {});
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciGraphQlService, deps: [{ token: i1.HttpClient }, { token: i2.GlobalService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciGraphQlService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciGraphQlService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.GlobalService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWNpLWdyYXBoLXFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91Y2ktY29uc29sZS9zcmMvbGliL3NlcnZpY2VzL3VjaS1ncmFwaC1xbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7O0FBTzNDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxXQUFXO0lBRzlDLFlBQW1CLElBQWdCLEVBQVMsYUFBNEI7UUFDcEUsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQURaLFNBQUksR0FBSixJQUFJLENBQVk7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUVwRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxLQUFLLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO2FBQ3pDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNwQixLQUFLLEVBQUU7O29CQUVDO1NBQ1gsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BCLEtBQUssRUFBRTs7O3VCQUdJO1lBQ1gsU0FBUyxFQUFFLEtBQUs7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BCLEtBQUssRUFBRTs7Ozs7O2NBTUw7WUFDRixTQUFTLEVBQUUsS0FBSztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBSztRQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDcEIsS0FBSyxFQUFFOzs7Ozs7OztjQVFMO1lBQ0YsU0FBUyxFQUFFLEtBQUs7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BCLEtBQUssRUFBRTs7OztjQUlMO1lBQ0YsU0FBUyxFQUFFLEtBQUs7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDcEIsS0FBSyxFQUFFOzs7OztxQkFLRTtTQUNaLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BCLEtBQUssRUFBRTs7O3lCQUdNO1NBQ2hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxXQUFXLENBQUMsSUFBSTtRQUNwQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7K0dBM0ZRLGlCQUFpQjttSEFBakIsaUJBQWlCLGNBRmQsTUFBTTs7NEZBRVQsaUJBQWlCO2tCQUg3QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7QmFzZVNlcnZpY2V9IGZyb20gJy4vYmFzZS5zZXJ2aWNlJztcbmltcG9ydCB7R2xvYmFsU2VydmljZX0gZnJvbSAnLi9nbG9iYWwuc2VydmljZSc7XG5cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBVY2lHcmFwaFFsU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcbiAgICBCQVNFX1VSTDtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBodHRwOiBIdHRwQ2xpZW50LCBwdWJsaWMgZ2xvYmFsU2VydmljZTogR2xvYmFsU2VydmljZSkge1xuICAgICAgICBzdXBlcihodHRwLCBnbG9iYWxTZXJ2aWNlKTtcbiAgICAgICAgdGhpcy5nbG9iYWxTZXJ2aWNlLmJhc2VVcmwkLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkJBU0VfVVJMID0gdmFsdWUgKyAnL3YxL2dyYXBocWwnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVJlcXVlc3Qoe1xuICAgICAgICAgICAgcXVlcnk6IGBxdWVyeSBnZXRMaXN0T2ZTdGF0ZXN7XG4gICAgICAgICAgICBvcmdhbmlzYXRpb24oZGlzdGluY3Rfb246c3RhdGUpe1xuICAgICAgICAgICAgc3RhdGV9fWBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0RGlzdHJpY3QocGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVJlcXVlc3Qoe1xuICAgICAgICAgICAgcXVlcnk6IGBxdWVyeSBnZXRMaXN0T2ZEaXN0cmljdEluU3RhdGUoJHN0YXRlOlN0cmluZyl7XG4gICAgICAgICAgICBvcmdhbmlzYXRpb24od2hlcmU6e3N0YXRlOntfZXE6JHN0YXRlfX0sICBkaXN0aW5jdF9vbjpkaXN0cmljdCl7XG4gICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICAgZGlzdHJpY3R9fWAsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHBhcmFtXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEJsb2NrKHBhcmFtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2VSZXF1ZXN0KHtcbiAgICAgICAgICAgIHF1ZXJ5OiBgcXVlcnkgZ2V0TGlzdE9mQmxvY2tzVW5kZXJEaXN0cmljdCgkZGlzdHJpY3Q6W1N0cmluZyFdLCRzdGF0ZTpTdHJpbmcpe1xuICAgICAgICAgICAgYmxvY2tzOiBvcmdhbmlzYXRpb24od2hlcmU6e3N0YXRlOntfZXE6JHN0YXRlfSxkaXN0cmljdDp7X2luOiRkaXN0cmljdH19LGRpc3RpbmN0X29uOmJsb2NrKXtcbiAgICAgICAgICAgIGJsb2NrXG4gICAgICAgICAgICBkaXN0cmljdFxuICAgICAgICAgICAgc3RhdGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1gLFxuICAgICAgICAgICAgdmFyaWFibGVzOiBwYXJhbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTY2hvb2xEZXRhaWxzKHBhcmFtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2VSZXF1ZXN0KHtcbiAgICAgICAgICAgIHF1ZXJ5OiBgcXVlcnkgZ2V0TGlzdE9mU2Nob29sc1VuZGVyQmxvY2tzQW5kRGlzdHJpY3QoJGRpc3RyaWN0OltTdHJpbmchXSwkc3RhdGU6U3RyaW5nLCRibG9jazpbU3RyaW5nIV0pe1xuICAgICAgICAgICAgc2Nob29sczpvcmdhbmlzYXRpb24od2hlcmU6e3N0YXRlOntfZXE6JHN0YXRlfSxkaXN0cmljdDp7X2luOiRkaXN0cmljdH0sYmxvY2s6e19pbjokYmxvY2t9fSl7XG4gICAgICAgICAgICBzY2hvb2xcbiAgICAgICAgICAgIHNjaG9vbF9jb2RlXG4gICAgICAgICAgICBibG9ja1xuICAgICAgICAgICAgZGlzdHJpY3RcbiAgICAgICAgICAgIHN0YXRlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB9YCxcbiAgICAgICAgICAgIHZhcmlhYmxlczogcGFyYW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0Q2x1c3RlcnMocGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVJlcXVlc3Qoe1xuICAgICAgICAgICAgcXVlcnk6IGBxdWVyeSBnZXRMaXN0T2ZDbHVzdGVyc1VuZGVyQmxvY2tBbmREaXN0cmljdCgkYmxvY2s6W1N0cmluZyFdLCRkaXN0cmljdDpbU3RyaW5nIV0sJHN0YXRlOlN0cmluZyl7XG4gICAgICAgICAgICBjbHVzdGVyczpvcmdhbmlzYXRpb24od2hlcmU6e3N0YXRlOntfZXE6JHN0YXRlfSxkaXN0cmljdDp7X2luOiRkaXN0cmljdH0sYmxvY2s6e19pbjokYmxvY2t9fSxkaXN0aW5jdF9vbjpjbHVzdGVyKXtcbiAgICAgICAgICAgIGNsdXN0ZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1gLFxuICAgICAgICAgICAgdmFyaWFibGVzOiBwYXJhbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRSb2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNlUmVxdWVzdCh7XG4gICAgICAgICAgICBxdWVyeTogYHF1ZXJ5IGZldGNoTGlzdE9mUm9sZXN7XG4gICAgICAgICAgICAgICAgICAgcm9sZXtcbiAgICAgICAgICAgICAgICAgICBpZFxuICAgICAgICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfWBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0Qm9hcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNlUmVxdWVzdCh7XG4gICAgICAgICAgICBxdWVyeTogYHF1ZXJ5IGxpc3RPZkJvYXJkc3tcbiAgICAgICAgICAgICAgICAgIGJvYXJke1xuICAgICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgICAgICAgIG5hbWV9fWBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBiYXNlUmVxdWVzdChib2R5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLkJBU0VfVVJMLCBib2R5LCB7fSk7XG4gICAgfVxufVxuIl19