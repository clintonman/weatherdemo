var myApp = angular.module('weatherApp', []);

myApp.controller("weatherCtrl", ["$scope", "$http", "getCityList","getCurrent",
                                 function($scope, $http, getCityList, getCurrent) {
    this.section = "first section";
    this.searches = [{
            "search": "",
            "searchresult": []
                     },
        {
            "search": "",
            "searchresult": []
        }];
    this.currentdata = {};
    this.currentdata.city = [{"name": "city1"},{"name":"city2"}];
    this.currentdata.high = [{"temp":100},{"temp":100}];
    this.currentdata.low = [{"temp":0},{"temp":0}];
    this.currentdata.now = [{"temp":50},{"temp":50}];
    this.currentdata.feel = [{"temp":50},{"temp":50}];
                                     
    this.hourlytemp = [[],[]];
    this.starthour = 0;
                                     

    this.updatesearch = function(index) {
        getCityList.getitems(this, index);
    };
    
    this.setcity = function(cityindex, listindex, thecity) {
        this.currentdata.city[cityindex].name = thecity;
        var location = this.searches[cityindex].searchresult[listindex].l;
        
        //might be locid instead of zmw - somehitg like /q/locid:RPPG0002;loctype:1 - probably ok
        var url = "http://api.wunderground.com/api/MY_KEY_HERE/conditions" 
                + location
                + "?callback=JSON_CALLBACK.json";
        
        console.log(url);
        
        //clear the search data
        this.searches[cityindex].search = "";
        this.searches[cityindex].searchresult = [];

        getCurrent.getitems(this, cityindex);
    }

}]);

myApp.service("getCurrent", ["$http", "getForecast", function($http, getForecast) {
    //testing 0 = palos, 1 = trabuco
    this.getitems = function(self, index) {
        var OK = 200;
        if(index==0) {
            $http.get("palosCurrent.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.current_observation;
                        console.log(currentData);
                        self.currentdata.now[index].temp = currentData.temp_f;
                        self.currentdata.feel[index].temp = currentData.feelslike_f;
                        getForecast.getitems(self, index);
                    }
            });
        }
        if(index==1) {
            $http.get("trabucoCurrent.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.current_observation;
                        console.log(currentData);
                        self.currentdata.now[index].temp = currentData.temp_f;
                        self.currentdata.feel[index].temp = currentData.feelslike_f;
                        getForecast.getitems(self, index);
                    }
            });
        }
    };
}]);

myApp.service("getForecast", ["$http", "getHourly", function($http, getHourly) {
    this.getitems = function(self, index) {
        var OK = 200;
        if(index==0) {
            $http.get("palosForecast.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.forecast.simpleforecast.forecastday[0];
                        console.log(currentData);
                        self.currentdata.high[index].temp = currentData.high.fahrenheit;
                        self.currentdata.low[index].temp = currentData.low.fahrenheit;
                        getHourly.getitems(self, index);
                    }
            });
        }
        if(index==1) {
            $http.get("trabucoForecast.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.forecast.simpleforecast.forecastday[0];
                        console.log(currentData);
                        self.currentdata.high[index].temp = currentData.high.fahrenheit;
                        self.currentdata.low[index].temp = currentData.low.fahrenheit;
                        getHourly.getitems(self, index);
                    }
            });
        }
    };
}]);

myApp.service("getHourly", ["$http", function($http) {
    this.getitems = function(self, index) {
        //console.log("hourly is next");
        var OK = 200;
        if(index==0) {
            $http.get("palosHourly.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.hourly_forecast;
                        console.log(currentData);
                        self.starthour = currentData[0].FCTTIME.hour;
                        self.hourlytemp[index] = currentData;
                    }
            });
        }
        if(index==1) {
            $http.get("trabucoHourly.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.hourly_forecast;
                        console.log(currentData);
                        self.starthour = currentData[0].FCTTIME.hour;
                        self.hourlytemp[index] = currentData;
                    }
            });
        }
    };
}]);

//get the weather underground autocomplete api list of city names and locations
myApp.service("getCityList", ["$http", function($http) {
    this.getitems = function(self, index) {

        var searchfield = self.searches[index].search;

        if (!searchfield || searchfield.length < 3) {
            self.searches[index].searchresult = [];
            return;
        }

        var myurl = "http://autocomplete.wunderground.com/aq?cb=JSON_CALLBACK&query=" + searchfield;

        var myhttp = $http({
            "method": "JSONP",
            "url": myurl
        });
        

        //return the http promise to the calling controller
        var OK = 200;
        return myhttp.then(function(response) {
                if (response.status == OK) {
                    self.searches[index].searchresult = response.data.RESULTS;
                }
            },
           //TODO Something more appropriate here
            function(response) {
                self.searches[index].searchresult = ["some error"];
            });

    };

}]);