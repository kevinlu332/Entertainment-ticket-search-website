var express = require('express');
var router = express.Router();
var url= require("url");
var https= require("https");
var ngeohash = require('ngeohash');
var moment = require('moment');

router.get('/curr_loc_chosen', function(req, res, next) {
    var q1 = url.parse(req.url, true);
    var params1=q1.query;
    var ghash = ngeohash.encode(params1.location_lat, params1.location_lng);
    // from client side
    // var url1 = "location_lat=" + curLocLat + '&' + "location_lng=" + curLocLon + '&' + "Keyword=" + $scope.form.keyword + '&' + "Category=" + $scope.userCategory+ '&' + "Distance=" + acturalDistance ;
    var SegmentId;
    if (params1.Category === "Music"){SegmentId = "KZFzniwnSyZfZ7v7nJ";}
    else if (params1.Category === "Sports"){SegmentId = "KZFzniwnSyZfZ7v7nE";}
    else if (params1.Category === "ArtsTheatre"){SegmentId = "KZFzniwnSyZfZ7v7na";}
    else if (params1.Category === "Film"){SegmentId = "KZFzniwnSyZfZ7v7nn";}
    else if (params1.Category === "Miscellaneous"){SegmentId = "KZFzniwnSyZfZ7v7n1";}
    else if (params1.Category === "All"){SegmentId = "";}
    else{    }
    let kkeyword;
    kkeyword = params1.Keyword;
    kkeyword = kkeyword.split(' ').join('+');
    let DDistance = params1.Distance;

    var url1='https://app.ticketmaster.com/discovery/v2/events.json?apikey=yGT4UZmzzJAMkAAHwapvuMWivbUe4l79'+'&';
    url1 += "keyword=" + kkeyword + '&' + "segmentId=" + SegmentId + '&' + "radius=" + DDistance + '&' +
        "unit=" + params1.Unit + "&geoPoint=" + ghash;
    console.log(url1);
    https.get(url1,function(req2, res2){
        var res_text1 = "";
        req2.on('data',function(data){
            res_text1+=data;
        });
        req2.on('end',function(){
// the rest is the same as the part of other_loc_chosen
            var obj1=JSON.parse(res_text1);
            if (obj1.page.totalElements ===0){res.send("No results");}
            else {

                var mysubobj1 = {};
                var key1=[];
                key1[0] = 'Date'; key1[1] = 'Event';key1[2] = 'Category';key1[3] = 'VenueInfo';key1[4] = 'JustTime'; key1[5] = 'ArtistTeam'; key1[6] = 'Time'; key1[7] = 'D_Category'; key1[8] = 'TicketStatus'; key1[9] = 'BuyTicketsAt'; key1[10] = 'SeatMap'; key1[11] = 'PriceRange';key1[12]= 'D_address';      key1[13]='D_city'; key1[14]='id'; key1[15]='attract_names'; key1[16]='vID';key1[17]='vLat'; key1[18]='vLon'; key1[19]='segment';
                var events={};
                events[0] = [];
                for (let j = 0;j< obj1._embedded.events.length; j++ ) {
                    mysubobj1={};
                    mysubobj1[key1[0]] = obj1._embedded.events[j].dates.start.localDate;
                    mysubobj1[key1[1]] = obj1._embedded.events[j].name;
                    mysubobj1[key1[2]] = obj1._embedded.events[j].classifications[0].genre.name + '-' + obj1._embedded.events[j].classifications[0].segment.name;
                    mysubobj1[key1[3]] = obj1._embedded.events[j]._embedded.venues[0].name;
                    mysubobj1[key1[4]] = obj1._embedded.events[j].dates.start.localTime;
                    if (obj1._embedded.events[j]._embedded.attractions[0].name!==undefined) {
                        let infohere = '';
                        for (let k = 0; k < obj1._embedded.events[j]._embedded.attractions.length; k++) {
                            if (k !== 0) {
                                infohere += ' | '
                            }
                            infohere += obj1._embedded.events[j]._embedded.attractions[k].name;
                            if (k === obj1._embedded.events[j]._embedded.attractions.length - 1) {
                                mysubobj1[key1[5]] = infohere;
                            }
                        }
                    }
                    else {  };


                    let conv = obj1._embedded.events[j].dates.start.localDate;
                    conv = moment(conv, "YYYY-MM-DD").format('ll');
                    if (obj1._embedded.events[j].dates.start.localTime===undefined) {
                        mysubobj1[key1[6]] = conv;
                    }else{ mysubobj1[key1[6]] = conv +' '+ obj1._embedded.events[j].dates.start.localTime;
                    }

                    if (obj1._embedded.events[j].classifications[0].segment.name===undefined || obj1._embedded.events[j].classifications[0].genre.name ===undefined) {
                    }
                    else {
                        mysubobj1[key1[7]] = obj1._embedded.events[j].classifications[0].segment.name + ' | ' + obj1._embedded.events[j].classifications[0].genre.name;
                    }

                    if (obj1._embedded.events[j].dates.status.code!==undefined) {
                        mysubobj1[key1[8]] = obj1._embedded.events[j].dates.status.code;
                    }else {}

                    if (obj1._embedded.events[j].url!==undefined) {
                        mysubobj1[key1[9]] = obj1._embedded.events[j].url;
                    }else {}

                    if (obj1._embedded.events[j].seatmap!==undefined) {
                        mysubobj1[key1[10]] = obj1._embedded.events[j].seatmap.staticUrl;
                    }else {}

                    if (mysubobj1[key1[11]] = obj1._embedded.events[j].priceRanges===undefined || obj1._embedded.events[j].priceRanges === undefined) { }
                    else {
                        mysubobj1[key1[11]] = "$" + obj1._embedded.events[j].priceRanges[0].min.toFixed(2) + ' ~ $' + obj1._embedded.events[j].priceRanges[0].max.toFixed(2);
                    }
                    if (obj1._embedded.events[j]._embedded.venues[0].address !== undefined) {
                        mysubobj1[key1[12]] = obj1._embedded.events[j]._embedded.venues[0].address.line1;
                    } else {  }
                    if (obj1._embedded.events[j]._embedded.venues[0].city!== undefined && obj1._embedded.events[j]._embedded.venues[0].state!==undefined){
                        mysubobj1[key1[13]] = obj1._embedded.events[j]._embedded.venues[0].city.name+', '+ obj1._embedded.events[j]._embedded.venues[0].state.name;
                    }
                    if (obj1._embedded.events[j].id !== undefined) {
                        mysubobj1[key1[14]]=obj1._embedded.events[j].id;
                    }
                    else{ mysubobj1[key1[14]]='Id unknown!'; }
                    if (obj1._embedded.events[j]._embedded.attractions[0].name!==undefined) {
                        let infohere = '';
                        let subpart = [];
                        for (let k = 0; k < obj1._embedded.events[j]._embedded.attractions.length; k++) {
                            subpart[k]= obj1._embedded.events[j]._embedded.attractions[k].name;
                            mysubobj1[key1[15]]= subpart;
                            }
                        }
                    if (obj1._embedded.events[j]._embedded.venues!==undefined) {
                        mysubobj1[key1[16]]=obj1._embedded.events[j]._embedded.venues[0].id;
                    }
                    if (obj1._embedded.events[j]._embedded.venues!==undefined) {
                        mysubobj1[key1[17]]=obj1._embedded.events[j]._embedded.venues[0].location.latitude;
                        mysubobj1[key1[18]]=obj1._embedded.events[j]._embedded.venues[0].location.longitude;
                    }
                    if (obj1._embedded.events[j].classifications[0].segment!==undefined) {
                        mysubobj1[key1[19]]=obj1._embedded.events[j].classifications[0].segment.name;
                    }

                    events[j]=mysubobj1;

                }
                //events['fullinfo'] = obj1;
                res.send(events);
            }
        });

    });
});



module.exports = router;
