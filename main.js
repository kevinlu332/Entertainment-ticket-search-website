var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var curr_loc_chosenRouter = require('./routes/curr_loc_chosen');
var other_loc_chosenRouter = require('./routes/other_loc_chosen');
var getPhotos = require('./routes/getPhotos');
var getSpotify = require('./routes/getSpotify');
var getSpotifyCredential = require('./routes/getSpotifyCredential');
var getVenueDetail = require('./routes/getVenueDetail');
var getVenueDetail = require('./routes/getVenueDetail');
var getVenueDetail = require('./routes/getVenueDetail');


var main = express();

main.use(logger('dev'));
main.use(express.json());
main.use(express.urlencoded({ extended: false }));
main.use(cookieParser());
main.use(express.static(path.join(__dirname, 'public')));

main.use('/', indexRouter);
main.use('/users', usersRouter);
main.get('/curr_loc_chosen', curr_loc_chosenRouter);
main.get('/other_loc_chosen', other_loc_chosenRouter);
main.get('/getPhotos', getPhotos);
main.get('/getSpotify', getSpotify);
main.get('/getSpotifyCredential', getSpotifyCredential);
main.get('/getVenueDetail', getVenueDetail);
main.get('/getVenueDetail', getVenueDetail);
main.get('/getVenueDetail', getVenueDetail);






module.exports = main;
