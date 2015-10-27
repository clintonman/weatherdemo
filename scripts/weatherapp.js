var myApp = angular.module('weatherApp', []);

myApp.controller("weatherCtrl", ["$scope", "$http", "getCityList", function ($scope, $http, getCityList) {
    this.section = "first section";
    this.searchresult1 = [];

    self = this;

    this.updatesearch = function (list) {
        if(list==1) {
            if (this.search1 && this.search1.length > 2) {
                getCityList.getem(this.search1, list);

            }
            else {
                self.searchresult1 = [];
            }
        }
        if(list==2) {
            if (this.search2 && this.search2.length > 2) {
                getCityList.getem(this.search2, list);

            }
            else {
                self.searchresult2 = [];
            }
        }
    };

}]);

myApp.service("getCityList", ["$http", function($http, searchfield){
    self=this;
    this.getem = function(searchfield, list) {
        
        var myurl = "http://autocomplete.wunderground.com/aq?cb=JSON_CALLBACK&query=" + searchfield ;

        var myhttp = $http({
                "method": "JSONP",
                "url": myurl
            })
            if(list==1) {
                return myhttp.then(function(response) {
                    if(response.status == 200) {
                       self.searchresult1 = response.data.RESULTS;
                    }
                }, function (response) {
                     self.searchresult1 = ["some error"];
                });
            }
            if(list==2) {
                return myhttp.then(function(response) {
                    if(response.status == 200) {
                       self.searchresult2 = response.data.RESULTS;
                    }
                }, function (response) {
                     self.searchresult2 = ["some error"];
                });
            }
        
    };
    
    
}]);
