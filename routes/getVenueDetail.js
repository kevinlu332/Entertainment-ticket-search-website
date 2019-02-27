var express = require('express');
var router = express.Router();
var url= require("url");
var https= require("https");


router.get('/getVenueDetail', function(req, res, next) {
    let q1 = url.parse(req.url, true);
    let params1=q1.query;


            url3  = 'https://app.ticketmaster.com/discovery/v2/venues/'+params1.vID +'.json?apikey=yGT4UZmzzJAMkAAHwapvuMWivbUe4l79';
            let obj2;
            https.get(url3,function(req2, res2) {
                let res_text2 = "";
                req2.on('data',function(data){
                    res_text2+=data;
                });
                req2.on('end',function() {
                    obj2=JSON.parse(res_text2);
                   res.send(obj2);
                });
            });


});



module.exports = router;


