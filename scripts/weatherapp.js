var myApp = angular.module('weatherApp', []);

myApp.controller("weatherCtrl", ["$scope", "$http", "$filter", function ($scope, $http, $filter) {
    this.section = "first section";
    this.searchresult1 = "waiting...";
    self = this;
    
    this.updatesearch = function () {
        console.log(this.search1);
        //http://autocomplete.wunderground.com/aq?query=Trabuco
        if (this.search1 && this.search1.length > 3) {
            var myurl = "http://autocomplete.wunderground.com/aq?query=" + this.search1 + "&cb=JSON_CALLBACK";
            console.log(myurl);

            $http({
                    "method": "JSONP",
                    "url": myurl
                })
                .then(function(response) {
                    if(response.status == 200) {
                        console.log(response.data);
                        self.searchresult1 = $filter('json')(response.data);
                    } else {
                        console.log("not yet");
                    }
                }, function (response) {
                    //console.log(response);
                    self.searchresult1 = "some error";
                });
        }
    };

     }]);
