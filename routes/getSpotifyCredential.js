var express = require('express');
var router = express.Router();
var url= require("url");
var https= require("https");


router.get('/getSpotifyCredential', function(req, res, next) {

    var SpotifyWebApi = require('spotify-web-api-node');

    var spotifyApi = new SpotifyWebApi({
        clientId: '6a496224707743ca893bbb0ba2520a06',
        clientSecret: '24c2416154984e3aba57e147a4eb5a84',
        redirectUri: 'http://www.example.com/callback'
    });

// Get an access token and 'save' it using a setter
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            console.log('The access token is ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
            res.send(data.body['access_token']);
        },
        function (err) {
            console.log('Something went wrong!', err);
        }
    );

});




module.exports = router;
