import express  from "express";
import request  from "request";
import xml2js from "xml2js";
import mongoose from "mongoose";
import Story from './models/Story.js';
import Channel from './models/Channel';
require('es6-promise').polyfill();
require('isomorphic-fetch');

let app = express();
let server = app.listen(8080);
let io = require('socket.io').listen(server);

mongoose.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");

io.on('connection', function(socket){
  console.log('a user connected');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  request('http://rss.cnn.com/rss/cnn_topstories.rss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let parseString = xml2js.parseString;
      parseString(body, function(err, result){
        //console.log(result);
        console.log(result.rss.channel[0].item[0])

        res.send(result.rss.channel[0].item[0]);
      });
    } else {
      res.send('whos mans is thih?');
    }
  })

});

app.get('/stories', function(req, res){
  Story.find({}, function(error, docs){
    if(!error){
      res.status(200).send(docs);
    } else {
      res.status(500).send(error);
    }
  })
});

app.get('/channels', function(req, res){
  Channel.find({}, function(error, docs){
    if(!error){
      res.status(200).send(docs);
    } else {
      res.status(500).send(error);
    }
  })
});