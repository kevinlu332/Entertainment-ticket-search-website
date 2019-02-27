var app = angular.module('bodyApp', ['ngMaterial','ngAnimate', 'ngMap']);


app.controller('bodyContrlr', function($scope,$http,$animate,NgMap ) {
    $scope.userCategory = "All";
    $scope.distanceUnitInputted = "miles";
    $scope.location = "Here";
    //first tryout for fun: set initial variables
    if ($scope.formDistance === undefined) {
        if ($scope.distanceUnitInputted === "Miles") {
            $scope.initial = {Keyword: "", Category: "All", Distance: "10"};
        } else if ($scope.distanceUnitInputted === "Kilometers") {
            $scope.initial = {Keyword: "", Category: "All", Distance: "6.21371"};
        }
    }
    //console.log($scope.initial);


    //current location api
    var curLocObj, curLocLat, curLocLon;
    $http.get("http://ip-api.com/json")
        .then(function (response) {
            curLocObj = response.data;
            curLocLat = response.data.lat;
            curLocLon = response.data.lon;
        });

    $scope.clearAll = function() {
        $scope.table = [];
        for (var i = 0; i < 3; i++) {
            $scope.table.push({table1Content: undefined, tableStatustext: undefined, tableStatustext2: undefined});
        }
        $scope.location = "Here";
        $scope.showFav = false;
        $scope.showDetailsBut = false; //disable detail button
        $scope.show_detail = false;//hide detail form
        $scope.showTable=false;
        function resetit(){
            if( document.getElementById('favBut').classList.contains('btn-primary')){
                $("#favBut").removeClass("btn-primary");
                $("#favBut").addClass("btn-link");
                $("#resultsBut").removeClass("btn-link");
                $("#resultsBut").addClass("btn-primary");
            }
            document.getElementById("fromHere").setAttribute("checked", "checked");
            document.getElementById("theOtherLoc").disabled=true;
            $scope.$apply();
        }
        resetit();
        console.log('cleared all!');
    };



    //make the first page table
    $scope.table = [];
    //get the table data
    $scope.progressbar = false;

    $scope.startSearch = function () {
        $scope.showTable=true;
        $scope.show_detail = false;
        $scope.showDetailsBut = true;
        $scope.progressbar = true;
        let acturalDistance;


        if ($scope.formDistance === undefined) {
            acturalDistance = 10;
        } else {
            acturalDistance = $scope.formDistance;
        }

        let response1 = '';
        if ($scope.location === "Here") {
            let url1 = "location_lat=" + curLocLat + '&' + "location_lng=" + curLocLon + '&' + "Keyword=" + $scope.form.keyword + '&' + "Category=" + $scope.userCategory + '&' + "Distance=" + acturalDistance + '&' + "Unit=" + $scope.distanceUnitInputted;
            console.log(url1);
            $http.get("/curr_loc_chosen?" + url1)
                .then(function (response) {
                    response1 = response;
                    console.log(response1.data);
                    if (response1.data === "No results") {
                        $scope.progressbar = false;
                        $scope.tableStatustext2 = "No results";
                    } else {
                        $scope.details_status = true;
                        $scope.tableStatustext2 = "Good";
                        $scope.table1Content = response1.data;
                        $scope.tableStatustext = response.statusText;
                        $scope.detail_button = true;
                        $scope.progressbar = false;

                    }
                });
        }
        else if ($scope.location === "location") {
            let LocAddress = $scope.theOtherLoc;
            let url1 = "LocAddress=" + LocAddress + '&' + "Keyword=" + $scope.form.keyword + '&' + "Category=" + $scope.userCategory + '&' + "Distance=" + acturalDistance + '&' + "Unit=" + $scope.distanceUnitInputted;

            $http.get("/other_loc_chosen?" + url1)
                .then(function (response) {
                    response1 = response;
                    console.log(response1);
                    if (response1.data === "location error") {
                        $scope.progressbar = false;
                        $scope.tableStatustext = "INVALID_REQUEST";
                    }
                    else if (response1.data === "No results" && response1.data !== "location error") {
                        $scope.progressbar = false;
                        $scope.tableStatustext2 = "No results";
                    }
                    else {
                        if (response1.data !== 'INVALID_REQUEST' && response1.data !== 'No results') {
                            $scope.details_status = true;
                            $scope.tableStatustext2 = "Good";
                            $scope.table1Content = response1.data;
                            $scope.tableStatustext = response.statusText;
                            $scope.detail_button = true;
                            $scope.progressbar = false;
                        } else {
                        }
                        ;
                    }
                });
        }
        else {
        }

        $http.get("/getSpotifyCredential" )
            .then(function (response) {
                $scope.token = response.data;
            });
    };


    //relate to favourite table
    $scope.favouriteItems = {};
    $scope.showFav = false;

    for (x in localStorage) {//x is id
        $scope.favouriteItems[x] = JSON.parse(localStorage.getItem(x));
        if ($scope.favouriteItems[x] != null) {
        } else {
            delete $scope.favouriteItems[x];
        }

    }
    $scope.hasfavItems = !angular.equals($scope.favouriteItems, {});


    $scope.remove_fav = function (x) {
        localStorage.removeItem(x.id);
        delete $scope.favouriteItems[x.id];
        $scope.hasfavItems = !angular.equals($scope.favouriteItems, {});
        document.getElementById(x.id).classList.remove("yellow");
        document.getElementById(x.id).innerHTML = "star_border";
        $scope.$apply();

    }


    $scope.set_fav = function (x) {
        if (document.getElementById(x.id).innerHTML === 'star_border') {
            document.getElementById(x.id).innerHTML = "star";
            document.getElementById(x.id).classList.add("yellow");
            localStorage.setItem(x.id, JSON.stringify(x));
            $scope.favouriteItems[x.id] = x;
        } else if (document.getElementById(x.id).innerHTML === "star") {
            document.getElementById(x.id).classList.remove("yellow");
            document.getElementById(x.id).innerHTML = "star_border";
            localStorage.removeItem(x.id);
            delete $scope.favouriteItems[x.id];
        } else {
        }
        $scope.hasfavItems = !angular.equals($scope.favouriteItems, {});
        $scope.$apply();
    }

    //RtoF & FtoR part
    $scope.RtoF = function () {
        $scope.showFav = true;
        $scope.show_detail = false;
    }
    $scope.FtoR = function () {
        $scope.showFav = false;
        $scope.show_detail = false;
    }
    $scope.ListFunction = function () {
        $scope.show_detail = false;
        $scope.showDetailsBut=true;
        $scope.$apply();
    }


    $scope.show_recent_detail = function () {
        $scope.show_detail = true;
        $scope.$apply();
    }

    //list and detail button
    $scope.detail_button = false;
    $scope.show_detail = false;

    //get_detail function part
    $scope.getDetails = function (x) {
        $scope.show_detail = true;
        $scope.showDetailsBut = false;
        $scope.current_x = x;
        $scope.d_event = x.Event;
        $scope.d_AT = x.ArtistTeam;
        $scope.d_Venue = x.VenueInfo;
        $scope.d_Time = x.Time;
        $scope.d_Category = x.D_Category;
        $scope.d_PriceRange = x.PriceRange;
        $scope.d_TicketStatus = x.TicketStatus;
        $scope.d_BTA = x.BuyTicketsAt;
        $scope.d_SeatMap = x.SeatMap;
        $scope.d_address = x.D_address;
        $scope.d_city = x.D_city;
        $scope.d_attract_names = x.attract_names;
        $scope.d_segment =  x.segment;
        $scope.twitter_text = "https://twitter.com/intent/tweet?text=Check out "+$scope.d_event+" locate at "+$scope.d_Venue+". Website:"+$scope.d_BTA+" #CSCI571EventSearch";


        if($scope.current_x.id in $scope.favouriteItems){
                     document.getElementById(x.id).innerHTML = "star";
            document.getElementById(x.id).classList.add("yellow");

        }
        else {
                    document.getElementById(x.id).classList.remove("yellow");
            document.getElementById(x.id).innerHTML = "star_border";
        }

        //for music people, do Spotify
        if(x.segment==='Music'){
            let response1={};
            let url1=[];
            for ( let i = 0; i < x.attract_names.length; i++) {
                url1[i] = "attract_name=" + x.attract_names[i]+'&token='+ $scope.token;
                $http.get("/getSpotify?" + url1[i])
                    .then(function (response) {
                        response1[i] = response.data;

                    });
            }
            $scope.d_Spotify=response1;
            console.log(response1);
        }




        //for getting the Artist/Teams pictures
        let response2 ={};
        let url2=[];
        for ( let i = 0; i < x.attract_names.length; i++) {
            url2[i] = "attract_name=" + x.attract_names[i];
            $http.get("/getPhotos?" + url2[i])
                .then(function (response) {
                    response2[i] = response.data;
                });
        }
        $scope.d_PhotosUrl=response2;
        console.log(response2);
        //for getting the venue information
        let response3='';
        $http.get("/getVenueDetail?" + "vID=" + x.vID)
            .then(function (response) {
                response3 = response.data;
                if (response3.boxOfficeInfo!==undefined){
                    $scope.Phone = response3.boxOfficeInfo.phoneNumberDetail;
                    $scope.openHours = response3. boxOfficeInfo.openHoursDetail;
                }
                if(response3.generalInfo!==undefined){
                    $scope.gRule = response3.generalInfo.generalRule;
                    $scope.cRule = response3.generalInfo.childRule;
                }
            });
//make the google map
        $scope.vlat = x.vLat; $scope.vlon =x.vLon;
        var bodyContrlr=this;
        NgMap.getMap().then(function(map) {
            bodyContrlr.map = map;
        });


    }
});