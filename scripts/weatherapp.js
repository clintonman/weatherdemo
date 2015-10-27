var myApp = angular.module('weatherApp', []);

myApp.controller("weatherCtrl", ["$scope", "$http", "getCityList", function ($scope, $http, getCityList) {
    this.section = "first section";
    this.searchresult1 = [];
    this.searches = [{"search":"",
                      "searchresult":[]
                     },
                    {"search":"",
                     "searchresult":[]
                    }];

    self = this;

    this.updatesearch = function (index) {
        var searchfield = this.searches[index].search;

        if(searchfield && searchfield.length > 2) {
            getCityList.getem(searchfield, index);
        }
        else {
            this.searches[index].searchresult = [];
        }
    };

}]);

myApp.service("getCityList", ["$http", function($http, searchfield){
    this.getem = function(searchfield, index) {
        
        var myurl = "http://autocomplete.wunderground.com/aq?cb=JSON_CALLBACK&query=" + searchfield ;

        var myhttp = $http({
                "method": "JSONP",
                "url": myurl
            })

        return myhttp.then(function(response) {
                    if(response.status == 200) {
                       self.searches[index].searchresult = response.data.RESULTS;
                    }
                },
               function (response) {
                    self.searches[index].searchresult = ["some error"];
                });
        
    };
    
    
}]);
