
import {takeUntil, filter} from 'rxjs/operators';
import { Subscription ,  Subject } from 'rxjs';
import { BreadcrumbsService } from '../../services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Input, AfterViewInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { IBreadcrumb } from '../../interfaces';
import * as _ from 'lodash';

/**
 * This component returns breadcrumbs in each relevant pages when provided
 * with routing data.
 */

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

    /**
     * This variable stores the data passed from routing module
     * of the current component.
     */
    breadCrumbsData: IBreadcrumb[];
    /**
     * This variable stores the root value of the most recent
     * activated route.
     */
    currentRoute: ActivatedRoute;
    /**
     * Reference of Router.
     */
    router: Router;
    /**
     * Reference of ActivatedRoute.
     */
    activatedRoute: ActivatedRoute;
    /**
     * Reference of BreadcrumbService.
     */
    breadcrumbsService: BreadcrumbsService;

    public unsubscribe = new Subject<void>();


    /**
     * The constructor
     * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute.
     * @param {Router} router Reference of Router.
     * @param {BreadcrumbsService} breadcrumbsService Reference of BreadcrumbsService.
     */
    constructor(activatedRoute: ActivatedRoute, router: Router, breadcrumbsService: BreadcrumbsService,
        private cdr: ChangeDetectorRef) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.breadcrumbsService = breadcrumbsService;
        this.cdr = cdr;
    }

    /**
     * To initialize breadcrumbs data.
     */
    ngOnInit() {
        /**
         * The breadcrumb data is gathered from router and by looping through each
         * child component.
         */
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                this.breadCrumbsData = [];
                let currentRoute = this.activatedRoute.root;
                while (currentRoute.children.length > 0) {
                    const child: ActivatedRoute[] = currentRoute.children;
                    let breadCrumbLabel: any = [];
                    child.forEach(route => {
                        currentRoute = route;
                        breadCrumbLabel = route.snapshot.data;
                        if (route.snapshot.data.breadcrumbs) {
                            this.breadCrumbsData = [...route.snapshot.data.breadcrumbs];
                        }
                    });
                }

            });

        /**
         * The breadcrumb service helps in passing dynamic breadcrumbs from
         * a selected component.
         */
        this.breadcrumbsService.dynamicBreadcrumbs.pipe(
        takeUntil(this.unsubscribe))
        .subscribe(data => {
            if (data.length > 0) {
            data.forEach(breadcrumb => {
            this.breadCrumbsData.push(breadcrumb);
            });
            }
            this.cdr.detectChanges();
        }
        );
    }

    /**
     * This method assists in redirecting the user to the chosen breadcrumb.
     * @param url The url returned by breadcrumb data.
     */
    openLink(url) {
        this.router.navigateByUrl(url);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

