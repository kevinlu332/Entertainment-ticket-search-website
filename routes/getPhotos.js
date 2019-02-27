var express = require('express');
var router = express.Router();
var url= require("url");
var https= require("https");


router.get('/getPhotos', function(req, res, next) {
    let q1 = url.parse(req.url, true);
    let params1=q1.query;
let obj1, obj2=[];
let kkeyword = params1.attract_name;
       kkeyword = kkeyword.split(' ').join('+');
       url2  = 'https://www.googleapis.com/customsearch/v1?q='+kkeyword+'&cx=017224937254617331432:i_jqp35qwhm&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyA8XjdOsEdYtgaETUMOuR8A20puTbTGVp0';
       https.get(url2,function(req2, res2) {
           let res_text1 = "";
           req2.on('data',function(data){
               res_text1+=data;
           });
           req2.on('end',function() {
               obj1=JSON.parse(res_text1);
               for (let i=0;i<obj1.items.length; i++){
                   obj2[i]=obj1.items[i].link;
               }

                res.send(obj2);
                 });
       });

});



module.exports = router;
