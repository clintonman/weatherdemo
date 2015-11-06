(function(){
angular.module('weatherApp').service("getCurrent", ["$http", "getForecast", function($http, getForecast) {
    //testing 0 = palos, 1 = trabuco
    this.getitems = function(self, index) {
        var OK = 200;
        if(index==0) {
            $http.get("palosCurrent.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.current_observation;
                        //console.log(currentData);
                        self.currentdata.now[index].temp = currentData.temp_f;
                        self.currentdata.feel[index].temp = currentData.feelslike_f;
                        self.currentdata.graphic[index].icon = currentData.icon_url;
                        getForecast.getitems(self, index);
                    }
            });
        }
        if(index==1) {
            $http.get("trabucoCurrent.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.current_observation;
                        //console.log(currentData);
                        self.currentdata.now[index].temp = currentData.temp_f;
                        self.currentdata.feel[index].temp = currentData.feelslike_f;
                        self.currentdata.graphic[index].icon = currentData.icon_url;
                        //console.log(self.currentdata.graphic[index].icon);
                        getForecast.getitems(self, index);
                    }
            });
        }
    };
}]);

angular.module('weatherApp').service("getForecast", ["$http", "getHourly", function($http, getHourly) {
    this.getitems = function(self, index) {
        var OK = 200;
        if(index==0) {
            $http.get("palosForecast.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.forecast.simpleforecast.forecastday[0];
                        //console.log(currentData);
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
                        //console.log(currentData);
                        self.currentdata.high[index].temp = currentData.high.fahrenheit;
                        self.currentdata.low[index].temp = currentData.low.fahrenheit;
                        getHourly.getitems(self, index);
                    }
            });
        }
    };
}]);

angular.module('weatherApp').service("getHourly", ["$http","plotHourly", function($http, plotHourly) {
    this.getitems = function(self, index) {
        //console.log("hourly is next");
        var OK = 200;
        if(index==0) {
            $http.get("palosHourly.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.hourly_forecast;
                        //console.log(currentData);
                        self.starthour = currentData[0].FCTTIME.hour;
                        self.hourlytemp[index] = currentData;
                        plotHourly.plot(self);
                    }
            });
        }
        if(index==1) {
            $http.get("trabucoHourly.json")
                .then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.hourly_forecast;
                        //console.log(currentData);
                        self.starthour = currentData[0].FCTTIME.hour;
                        self.hourlytemp[index] = currentData;
                        plotHourly.plot(self);
                    }
            });
        }
    };
}]);

angular.module('weatherApp').service("displayTemperature", [function(temp){
    this.convert = function(temp) {
        return "5.0"; 
    };
   
}]);

angular.module('weatherApp').service("plotHourly", [function(){
    this.plot = function(self) {
        if(self.hourlytemp[0].length > 0 && self.hourlytemp[1].length > 0) {
        //    alert("plot values");

            var high = Math.max(self.currentdata.high[0].temp, self.currentdata.high[1].temp);
            var low = Math.min(self.currentdata.low[0].temp, self.currentdata.low[1].temp);
            self.temperatures[0] = getTemperaturePoints(self.hourlytemp[0],high,low);
            self.temperatures[1] = getTemperaturePoints(self.hourlytemp[1],high,low);
        }
    };
    
    function getTemperaturePoints(arr, high, low) {
        //console.log(arr);
        //return;
        var range = high - low;
            var graphpoints = "";
            for(var i =0; i < 24; i++) {
                var scaledTemperature = 150 - (arr[i].temp.english - low) * 150 / range;
                graphpoints += i*400/23 +',' + scaledTemperature + ' ';
            }
            return graphpoints;
        }
}]);

//get the weather underground autocomplete api list of city names and locations
angular.module('weatherApp').service("getCityList", ["$http", function($http) {
    this.getitems = function(self, index) {

        var searchfield = self.searches[index].search;

        //if (!searchfield || searchfield.length < 3) {
        if (!searchfield) {
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
})();