'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular.module('playerApp', [
        'ngCookies',
        'ngRoute',
        'playerApp.config',
        'playerApp.errorMessages',
        'playerApp.labels',
        'ui.router',
        'ngStorage',
        'ui.pagedown',
        'pdf',
        'pascalprecht.translate',
        'ngSanitize',
        'ui.router.state.events',
        'uuid4'
    ]);
