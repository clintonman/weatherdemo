(function(){
angular.module('weatherApp').service("getCurrent", ["$http", "getForecast", function($http, getForecast) {
    this.getitems = function(self, index) {
        var OK = 200;
        var url = "http://api.wunderground.com/api/28fba46505b93796/conditions" 
                + self.cityLocationUrl
                + ".json?callback=JSON_CALLBACK";
        
        var myhttp = $http({
            "method": "JSONP",
            "url": url
        });
        
        if(index==0) {
            myhttp.then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.current_observation;
                        self.currentdata.now[index].temp = currentData.temp_f;
                        self.currentdata.feel[index].temp = currentData.feelslike_f;
                        self.currentdata.graphic[index].icon = currentData.icon_url;
                        getForecast.getitems(self, index);
                    }
            });
        }
        if(index==1) {
            myhttp.then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.current_observation;
                        self.currentdata.now[index].temp = currentData.temp_f;
                        self.currentdata.feel[index].temp = currentData.feelslike_f;
                        self.currentdata.graphic[index].icon = currentData.icon_url;
                        getForecast.getitems(self, index);
                    }
            });
        }
    };
}]);

angular.module('weatherApp').service("getForecast", ["$http", "getHourly", function($http, getHourly) {
    this.getitems = function(self, index) {
        var OK = 200;
        var url = "http://api.wunderground.com/api/28fba46505b93796/forecast" 
                + self.cityLocationUrl
                + ".json?callback=JSON_CALLBACK";
        
        var myhttp = $http({
            "method": "JSONP",
            "url": url
        });
        if(index==0) {
            myhttp.then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.forecast.simpleforecast.forecastday[0];
                        self.currentdata.high[index].temp = currentData.high.fahrenheit;
                        self.currentdata.low[index].temp = currentData.low.fahrenheit;
                        getHourly.getitems(self, index);
                    }
            });
        }
        if(index==1) {
            myhttp.then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.forecast.simpleforecast.forecastday[0];
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
        var OK = 200;
        var url = "http://api.wunderground.com/api/28fba46505b93796/hourly" 
                + self.cityLocationUrl
                + ".json?callback=JSON_CALLBACK";

        console.log(url);
        
        var myhttp = $http({
            "method": "JSONP",
            "url": url
        });
        if(index==0) {
            myhttp.then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.hourly_forecast;
                        self.starthours[0] = currentData[0].FCTTIME.hour;
                        self.hourlytemp[index] = currentData;
                        plotHourly.plot(self);
                    }
            });
        }
        if(index==1) {
            myhttp.then(function (response) {
                    if (response.status == OK) {
                        var currentData = response.data.hourly_forecast;
                        self.starthours[1] = currentData[0].FCTTIME.hour;
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
            for(var i =0; i < 24; i++) {
                if(self.hourlytemp[0][i].temp.english < self.minhourly) {
                    self.minhourly = self.hourlytemp[0][i].temp.english;
                }
                if(self.hourlytemp[0][i].temp.english > self.maxhourly) {
                    self.maxhourly = self.hourlytemp[0][i].temp.english;
                }
                if(self.hourlytemp[1][i].temp.english < self.minhourly) {
                    self.minhourly = self.hourlytemp[1][i].temp.english;
                }
                if(self.hourlytemp[1][i].temp.english > self.maxhourly) {
                    self.maxhourly = self.hourlytemp[1][i].temp.english;
                }
            }
            

            var high = Math.max(self.currentdata.high[0].temp, self.currentdata.high[1].temp);
            var low = Math.min(self.currentdata.low[0].temp, self.currentdata.low[1].temp);
            
            high = Math.max(high, self.maxhourly);
            low = Math.min(low, self.minhourly);
            
            self.maxplot = high;
            self.minplot = low;
            
            self.temperatures[0] = getTemperaturePoints(self.hourlytemp[0],high,low);
            self.temperatures[1] = getTemperaturePoints(self.hourlytemp[1],high,low);
            
            var offsetY = 10;
            var range = high - low;
            self.currentdata.high[0].plot = 150 - (self.currentdata.high[0].temp - low) * 150 / range + offsetY;
            self.currentdata.high[1].plot = 150 - (self.currentdata.high[1].temp - low) * 150 / range + offsetY;
            self.currentdata.low[0].plot = 150 - (self.currentdata.low[0].temp - low) * 150 / range + offsetY;
            self.currentdata.low[1].plot = 150 - (self.currentdata.low[1].temp - low) * 150 / range + offsetY;

        }
    };
    
    function getTemperaturePoints(arr, high, low) {
        var offsetY = 10;
        var offsetX = 30;
        var range = high - low;
        var graphpoints = "";
        for(var i =0; i < 24; i++) {
            var scaledTemperature = 150 - (arr[i].temp.english - low) * 150 / range + offsetY;
            graphpoints += (i*400/23+offsetX) +',' + scaledTemperature + ' ';
        }
        return graphpoints;
    }
}]);

//get the weather underground autocomplete api list of city names and locations
angular.module('weatherApp').service("getCityList", ["$http", function($http) {
    this.getitems = function(self, index) {

        var searchfield = self.searches[index].search;

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