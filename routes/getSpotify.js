var express = require('express');
var router = express.Router();
var url= require("url");
var https= require("https");


router.get('/getSpotify', function(req, res, next) {

    var SpotifyWebApi = require('spotify-web-api-node');
    let q1 = url.parse(req.url, true);
    let params1=q1.query;
    let kkeyword = params1.attract_name;
    let kkeyword2 = params1.attract_name;
    kkeyword = kkeyword.split(' ').join('+');
    var spotifyApi = new SpotifyWebApi({
        clientId: '6a496224707743ca893bbb0ba2520a06',
        clientSecret: '24c2416154984e3aba57e147a4eb5a84',
        redirectUri: 'http://www.example.com/callback',
        accessToken: params1.token
    });

// Search artists whose name contains 'Love'

    spotifyApi.searchArtists(kkeyword)
        .then(function(data) {

            let response = [];
            if(data.body.artists.items[0]===undefined){
                response[0]=undefined;
                response[1]=undefined;
                response[2]=undefined;
                response[3]=undefined;
                response[4]=false;
            }else{
                for(let i =0; i<data.body.artists.items.length;i++){
                    if (kkeyword2.toUpperCase() === data.body.artists.items[i].name.toUpperCase()) {
                        response[0] = data.body.artists.items[i].name;
                        response[1] = data.body.artists.items[i].followers.total.toLocaleString('en');
                        response[2] = data.body.artists.items[i].popularity;
                        response[3] = data.body.artists.items[i].external_urls.spotify;
                        response[4] = true;
                    }else{
                        if(i===data.body.artists.items.length-1){
                            response[0] = data.body.artists.items[0].name;
                            response[1] = data.body.artists.items[0].followers.total.toLocaleString('en');
                            response[2] = data.body.artists.items[0].popularity;
                            response[3] = data.body.artists.items[0].external_urls.spotify;
                            response[4] = true;
                                 }
                             }
                }

            }
            res.send(response);

        }, function(err) {
            console.error(err);
        });

});

module.exports = router;
