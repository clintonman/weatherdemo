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

    this.updatesearch = function(index) {
        getCityList.getem(this, index);
    };

}]);

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
        })

        return myhttp.then(function(response) {
                if (response.status == 200) {
                    self.searches[index].searchresult = response.data.RESULTS;
                }
            },
            function(response) {
                self.searches[index].searchresult = ["some error"];
            });

    };

}]);