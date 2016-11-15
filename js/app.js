angular.module('rli', ['ionic', 'rli.controllers', 'rli.routes', 'rli.services', 'rli.api', 'nvd3ChartDirectives', 'angularMoment'])

  .config(
  [function () {
  }]
  )

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    });
  });
