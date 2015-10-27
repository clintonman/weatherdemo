var myApp = angular.module('weatherApp', []);

myApp.controller("weatherCtrl", ["$scope", "$http", "getCityList", function($scope, $http, getCityList) {
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

    this.updatesearch = function(index) {
        getCityList.getem(this, index);
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
    }

}]);

//get the weather underground autocomplete api list of city names and locations
myApp.service("getCityList", ["$http", function($http) {
    this.getem = function(self, index) {

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
        return myhttp.then(function(response) {
                if (response.status == 200) {
                    self.searches[index].searchresult = response.data.RESULTS;
                }
            },
           //TODO Something more appropriate here
            function(response) {
                self.searches[index].searchresult = ["some error"];
            });

    };

}]);