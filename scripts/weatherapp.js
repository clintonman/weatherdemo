(function () {
    angular.module('weatherApp', []);

    angular.module('weatherApp').controller("weatherCtrl", ["$scope", "$http", "getCityList", "getCurrent", "displayTemperature", function ($scope, $http, getCityList, getCurrent, displayTemperature) {
        self = this;
        this.section = "1st app compare temperature forecast in 2 locations";
        this.searches = [{
                "search": "",
                "searchresult": []
                     },
            {
                "search": "",
                "searchresult": []
        }];
        this.currentdata = {};
        this.currentdata.city = [{
            "name": "city1"
        }, {
            "name": "city2"
        }];
        this.currentdata.high = [{
            "temp": 100,
            "plot": 30
        }, {
            "temp": 100,
            "plot": 30
        }];
        this.currentdata.low = [{
            "temp": 0,
            "plot": 130
        }, {
            "temp": 0,
            "plot": 130
        }];
        this.currentdata.now = [{
            "temp": 150.5
        }, {
            "temp": 150.5
        }];
        this.currentdata.feel = [{
            "temp": 50
        }, {
            "temp": 50
        }];
        this.currentdata.graphic = [{
                "icon": ""
            },
            {
                "icon": ""
            }];

        this.hourlytemp = [[], []];
        this.minhourly = 200;
        this.maxhourly = -200;
        this.minplot = 200;
        this.maxplot = -200;
        this.starthours = [0, 0];

        this.points = "20,100 40,60 70,80 100,20";
        this.temperatures = ["30,10 31,11", "30,10 31,11"];

        this.englishunits = true;
        this.tempunits = "F";
        this.cityLocationUrl = "";


        this.updatesearch = function (index) {
            getCityList.getitems(this, index);
        };

        this.setcity = function (cityindex, listindex, thecity) {
            if (thecity.length > 26) {
                thecity = thecity.substr(0, 26);
            }
            this.currentdata.city[cityindex].name = thecity;
            var location = this.searches[cityindex].searchresult[listindex].l;

            self.cityLocationUrl = location;

            //clear the search data
            this.searches[cityindex].search = "";
            this.searches[cityindex].searchresult = [];

            getCurrent.getitems(this, cityindex);
        }
        
        this.toggleunits = function () {
            if (this.englishunits) {
                this.englishunits = false;
                this.tempunits = "C";
            } else {
                this.englishunits = true;
                this.tempunits = "F";
            }
        };
        
        this.convert = function (temp) {
            if (this.englishunits) {
                return (temp * 1).toFixed(1);
            } else {
                return ((temp - 32) * 5 / 9).toFixed(1);
            }
        };
    }]);
})();
