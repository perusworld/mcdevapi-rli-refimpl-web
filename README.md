# Mastercard Developer API - Retail Location Insights - Reference Implementation - Angular/Express #

## [Demo](https://perusworld.github.io/mcdevapi-rli-refimpl-web/) ##

## Setup ##

1.Checkout the code
```bash
git clone https://github.com/perusworld/mcdevapi-rli-refimpl-web.git
```
2.Run bower install
```bash
bower install
```
3.Run npm install
```bash
npm install
```

## Running using dummy data ##
1.Start the app
```bash
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

## Running using MasterCard API ##
Make sure you have registered and obtained the API keys and p12 files from [https://developer.mastercard.com/](https://developer.mastercard.com/)

1.Start the app
```bash
export KEY_FILE=<your p12 file location>
export API_KEY=<your api key>
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

#### Some of the other options ####
```bash
export KEY_FILE_PWD=<p12 key password defaults to keystorepassword>
export KEY_FILE_ALIAS=<p12 key alias defaults to keyalias>
export SANDBOX=<sandbox or not defaults to true>
```
## Code ##
### Backend API Initialization ###
```javascript
var retailLocationInsights = require('mastercard-retail-location-insights');
var MasterCardAPI = retailLocationInsights.MasterCardAPI;
var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}
 var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
    MasterCardAPI.init({
        sandbox: 'true' === config.sandbox,
        authentication: authentication
    });
```
### Backend API Call (query available subscriptions) ###
```javascript
app.post('/subscriptions', function (req, res) {
    var requestData = {};
    retailLocationInsights.Subscriptions.query(requestData, function (error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                Subscriptions: {
                    Subscription: []
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Backend API Call (query MasterCard Retail Location Scores using unitType/unitId/country sent as part of JSON post) ###
```javascript
app.post('/metrics', function (req, res) {
    var requestData = {
        "PageLength": req.body.pageLength,
        "CountryCode": req.body.country,
        "PageOffset": req.body.pageOffset,
        "RetailUnitType": req.body.unitType,
        "RetailUnitId": req.body.unitId,
    };
    retailLocationInsights.RetailUnitsMetrics.query(requestData, function (error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                RetailUnitMetricResponse: {
                    PageOffset: "1",
                    TotalCount: 0,
                    RetailUnitMetrics: {
                        RetailUnitMetric: []
                    }
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Backend API Call (query retail unit census information using unitType/unitId/country sent as part of JSON post) ###
```javascript
app.post('/retailUnits', function (req, res) {
    var requestData = {
        "PageLength": req.body.pageLength,
        "CountryCode": req.body.country,
        "PageOffset": req.body.pageOffset
    };
    retailLocationInsights.RetailUnits.query(requestData, function (error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                RetailUnitResponse: {
                    PageOffset: "1",
                    TotalCount: 0,
                    RetailUnits: {
                        RetailUnit: []
                    }
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Backend API Call (query available merchant industry codes) ###
```javascript
app.post('/industries', function (req, res) {
    var requestData = {};
    retailLocationInsights.MerchantIndustries.query(requestData, function (error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                Subscriptions: {
                    Subscription: []
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Angular Service to retail location insights ###
```javascript
angular.module('rli.api', [])
    .service('RLIApi', ['$http', function ($http) {
        var ret = {
            retailUnits: function (req, callback) {
                var data = {
                    pageLength: req.pageLength,
                    country: req.country,
                    pageOffset: req.pageOffset
                }
                $http.post('/retailUnits', data).then(function successCallback(response) {
                    callback(response.data)
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
                });
            },
            subscriptions: function (callback) {
                var data = {
                }
                $http.post('/subscriptions', data).then(function successCallback(response) {
                    callback(response.data)
                });
            },
            industries: function (callback) {
                var data = {
                }
                $http.post('/industries', data).then(function successCallback(response) {
                    callback(response.data)
                });
            }
        };
        return ret;
    }])

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
```
### Angular Controller to get retail location insights ###
```javascript
    .controller('RetailUnitsCtrl', function($scope, RLIService) {
        $scope.retailUnits = {};
        var req = {
            pageLength: "10",
            country: "USA",
            pageOffset: "1"
        };
        RLIService.retailUnits(req, function(data) {
            $scope.retailUnits = data;
        });
    })

    .controller('MetricsCtrl', function($window, $scope, RLIService) {
        $scope.metrics = {};
        var req = {
            pageLength: "10",
            country: "USA",
            pageOffset: "1",
            unitType: "STATE",
            unitId: "06"
        };
        $scope.req = req;
        $scope.chartData = [];
        $scope.chart = {
            height: $window.innerHeight - 100,
            tick: [],
            sales: [],
            trans: [],
            tkt: [],
            grw: [],
            stb: [],
            comp: [],
            period: ""
        }
        $scope.xAxisTickFormat = function() {
            return function(value) {
                return $scope.chart.tick[value];
            };
        }
        RLIService.metrics(req, function(data) {
            $scope.metrics = data;
            $scope.chart.tick = [];
            $scope.chart.sales = [];
            $scope.chart.trans = [];
            $scope.chart.tkt = [];
            $scope.chart.grw = [];
            $scope.chart.stb = [];
            $scope.chart.comp = [];
            data.reduce(function(total, dtl) {
                $scope.chart.period = dtl.Period;
                $scope.chart.tick.push(dtl.RLIScores.CompositeIndustryName);
                $scope.chart.sales.push([$scope.chart.tick.length - 1, dtl.RLIScores.Sales]);
                $scope.chart.trans.push([$scope.chart.tick.length - 1, dtl.RLIScores.Transactions]);
                $scope.chart.tkt.push([$scope.chart.tick.length - 1, dtl.RLIScores.TicketSize]);
                $scope.chart.grw.push([$scope.chart.tick.length - 1, dtl.RLIScores.Growth]);
                $scope.chart.stb.push([$scope.chart.tick.length - 1, dtl.RLIScores.Stability]);
                $scope.chart.comp.push([$scope.chart.tick.length - 1, dtl.RLIScores.Composite]);
                return total + 1;
            });
            $scope.chartData = [
                {
                    "key": "Sales",
                    "values": $scope.chart.sales
                },
                {
                    "key": "Transactions",
                    "values": $scope.chart.trans
                },
                {
                    "key": "TicketSize",
                    "values": $scope.chart.tkt
                },
                {
                    "key": "Growth",
                    "values": $scope.chart.grw
                },
                {
                    "key": "Stability",
                    "values": $scope.chart.stb
                },
                {
                    "key": "Composite",
                    "values": $scope.chart.comp
                }
            ];
            console.log($scope.chartData);
        });
    })

    .controller('SubscriptionsCtrl', function($scope, RLIService) {
        $scope.subscriptions = {};
        RLIService.subscriptions(function(data) {
            $scope.subscriptions = data;
        });
    })

    .controller('IndustriesCtrl', function($scope, RLIService) {
        $scope.industries = {};
        RLIService.industries(function(data) {
            $scope.industries = data;
        });
    });
```
### Angular Template to display the list of subscriptions ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="sub in subscriptions" type="item-text-wrap">
        <h2>{{sub.CountryCode}}</h2>
        <p>{{sub.StateName}} - {{sub.StateId}}</p>
      </ion-item>
    </ion-list>
```
### Angular Template to display the MasterCard Retail Location Scores chart ###
```html
    <nvd3-multi-bar-chart 
        data="chartData" 
        id="chartData" 
        xAxisTickFormat="xAxisTickFormat()" 
        showLegend="true" 
        showControls="true"
        height="{{chart.height}}" 
        showXAxis="true" 
        showYAxis="true" 
        interactive="true" 
        tooltips="true" 
        noData="Please wait loading data...">
      <svg></svg>
    </nvd3-multi-bar-chart>
```
### Angular Template to display the list of retail unit census information ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="ru in retailUnits" type="item-text-wrap">
        <h2>{{ru.CountryName}} / {{ru.StateName}}</h2>
        <p>CensusTract - {{ru.CensusTract}}</p>
        <p>BlockGroup - {{ru.BlockGroup}}</p>
        <p>CensusBlock - {{ru.CensusBlock}}</p>
      </ion-item>
    </ion-list>
```
### Angular Template to display the list of merchant industry codes ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="ind in industries" type="item-text-wrap">
        <h2>{{ind.IndustryName}}</h2>
        <p>{{ind.Industry}}</p>
      </ion-item>
    </ion-list>
```
