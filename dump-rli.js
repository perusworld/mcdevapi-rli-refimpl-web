var fs = require('fs')
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

function writeObj(obj, file, callback) {
    fs.writeFile("www/data/" + file, JSON.stringify(obj), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        callback();
    });
}

function dumpRetailUnits() {
    var requestData = {
        "PageLength": "10",
        "CountryCode": "USA",
        "PageOffset": "1"
    };

    retailLocationInsights.RetailUnits.query(requestData,
        function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "retailUnits.json", function () {
                    console.log('done');
                });

            }
        });
}

function dumpMetrics() {
    var requestData = {
        "PageLength": "100",
        "CountryCode": "USA",
        "RetailUnitType": "STATE",
        "RetailUnitId": "06",
        "PageOffset": "1"
    };

    retailLocationInsights.RetailUnitsMetrics.query(requestData,
        function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "metrics.json", function () {
                    console.log('done');
                });

            }
        });
}

function dumpSubscriptions() {
    var requestData = {};

    retailLocationInsights.Subscriptions.query(requestData,
        function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "subscriptions.json", function () {
                    console.log('done');
                });

            }
        });
}

function dumpIndustries() {
    var requestData = {};

    retailLocationInsights.MerchantIndustries.query(requestData,
        function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "industries.json", function () {
                    console.log('done');
                });

            }
        });
}

dumpRetailUnits();
dumpMetrics();
dumpSubscriptions();
dumpIndustries();