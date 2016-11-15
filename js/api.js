angular.module('rli.api', [])


    .service('RLIApi', ['$http', function ($http) {
        var ret = {
            getJson: function (file, callback) {
                $http.get('/mcdevapi-rli-refimpl-web/data/' + file).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    $http.get('/data/' + file).then(function successCallback(response) {
                        callback(response.data)
                    }, function errorCallback(response) {
                        callback(null);
                    });
                });
            },
            retailUnits: function (req, callback) {
                var data = {
                    pageLength: req.pageLength,
                    country: req.country,
                    pageOffset: req.pageOffset
                }
                $http.post('/retailUnits', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("retailUnits.json", callback);
                });
            },
            metrics: function (req, callback) {
                var data = {
                    pageLength: req.pageLength,
                    country: req.country,
                    pageOffset: req.pageOffset,
                    unitType: req.unitType,
                    unitId: req.unitId
                }
                $http.post('/metrics', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("metrics.json", callback);
                });
            },
            subscriptions: function (callback) {
                var data = {
                }
                $http.post('/subscriptions', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("subscriptions.json", callback);
                });
            },
            industries: function (callback) {
                var data = {
                }
                $http.post('/industries', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("industries.json", callback);
                });
            }
        };
        return ret;

    }]);

