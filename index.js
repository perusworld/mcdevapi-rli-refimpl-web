var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs')
var app = express();
var retailLocationInsights = require('mastercard-retail-location-insights');
var MasterCardAPI = retailLocationInsights.MasterCardAPI;

var dummyData = [];
var dummyDataFiles = ['www/data/retailUnits.json', 'www/data/metrics.json', 'www/data/subscriptions.json', 'www/data/industries.json'];
dummyDataFiles.forEach(function (file) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        dummyData[file] = JSON.parse(data);
    });
});

var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}

var useDummyData = null == config.p12file;
if (useDummyData) {
    console.log('p12 file info missing, using dummy data')
} else {
    console.log('has p12 file info, using MasterCardAPI')
    var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
    MasterCardAPI.init({
        sandbox: 'true' === config.sandbox,
        authentication: authentication
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('www'));

app.post('/retailUnits', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[0]]);
    } else {
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

    }
});

app.post('/metrics', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[1]]);
    } else {
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

    }
});

app.post('/subscriptions', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[2]]);
    } else {
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

    }
});

app.post('/industries', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[3]]);
    } else {
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

    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
