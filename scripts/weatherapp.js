(function(){
    angular.module('weatherApp', []);
    
    angular.module('weatherApp').controller("weatherCtrl", ["$scope", "$http", "getCityList","getCurrent","displayTemperature", function($scope, $http, getCityList, getCurrent, displayTemperature) {
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
    this.currentdata.city = [{"name": "city1"},{"name":"city2"}];
    this.currentdata.high = [{"temp":100},{"temp":100}];
    this.currentdata.low = [{"temp":0},{"temp":0}];
    this.currentdata.now = [{"temp":150.5},{"temp":150.5}];
    this.currentdata.feel = [{"temp":50},{"temp":50}];
    this.currentdata.graphic = [{"icon":""},
                                {"icon":""}];
                                     
    this.hourlytemp = [[],[]];
    this.starthour = 0;
                                     
    this.points = "20,100 40,60 70,80 100,20";
    this.temperatures = ["0,0 1,1","0,0 1,1"];
    
    this.englishunits = true;
    this.tempunits = "F";
        this.cityLocationUrl = "";
                                     

    this.updatesearch = function(index) {
        getCityList.getitems(this, index);
    };
    
    this.setcity = function(cityindex, listindex, thecity) {
        if(thecity.length > 26) {
            thecity = thecity.substr(0,26);
        }
        this.currentdata.city[cityindex].name = thecity;
        var location = this.searches[cityindex].searchresult[listindex].l;
        
        self.cityLocationUrl = location;
        
        //might be locid instead of zmw - somehitg like /q/locid:RPPG0002;loctype:1 - probably ok
        //var url = "http://api.wunderground.com/api/MY_KEY_HERE/conditions" 
        //        + this.cityLocationUrl
        //        + "?callback=JSON_CALLBACK.json";
        
        //console.log(url);
        
        //clear the search data
        this.searches[cityindex].search = "";
        this.searches[cityindex].searchresult = [];

        getCurrent.getitems(this, cityindex);
    }
    this.toggleunits = function(){
        if(this.englishunits) {
            this.englishunits = false;
            this.tempunits = "C";
        } else {
            this.englishunits = true;
            this.tempunits = "F";
        }
    };
    this.convert = function(temp) {
        if(this.englishunits) {
            return (temp*1).toFixed(1);
        } else {
            return ((temp - 32)*5/9).toFixed(1);
        } 
    };

}]);


})();

