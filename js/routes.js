angular.module('rli.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.metrics', {
        url: '/metrics',
        views: {
          'tab-metrics': {
            templateUrl: 'templates/tab-metrics.html',
            controller: 'MetricsCtrl'
          }
        }
      })
      .state('tab.subscriptions', {
        url: '/subscriptions',
        views: {
          'tab-subscriptions': {
            templateUrl: 'templates/tab-subscriptions.html',
            controller: 'SubscriptionsCtrl'
          }
        }
      })
      .state('tab.industries', {
        url: '/industries',
        views: {
          'tab-industries': {
            templateUrl: 'templates/tab-industries.html',
            controller: 'IndustriesCtrl'
          }
        }
      })
      .state('tab.retailunits', {
        url: '/retail-units',
        views: {
          'tab-retailunits': {
            templateUrl: 'templates/tab-retailunits.html',
            controller: 'RetailUnitsCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/metrics');

  });
