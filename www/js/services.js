angular.module('rli.services', [])

    .factory('RLIService', function (RLIApi) {
        var ret = {
            retailUnits: function (req, callback) {
                RLIApi.retailUnits(req, function (data) {
                    if (null != data) {
                        callback(data.RetailUnitResponse.RetailUnits.RetailUnit);
                    }
                });
            },
            metrics: function (req, callback) {
                RLIApi.metrics(req, function (data) {
                    if (null != data) {
                        callback(data.RetailUnitMetricResponse.RetailUnitMetrics.RetailUnitMetric);
                    }
                });
            },
            subscriptions: function (callback) {
                RLIApi.subscriptions(function (data) {
                    if (null != data) {
                        callback(data.Subscriptions);
                    }
                });
            },
            industries: function (callback) {
                RLIApi.industries(function (data) {
                    if (null != data) {
                        callback(data.MerchantIndustries.MerchantIndustry);
                    }
                });
            }
        };
        return ret;
    });
