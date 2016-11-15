angular.module('rli.controllers', [])

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
