const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var randomstring = require("randomstring");
const fs = require('fs');
server.listen(8080);


app.get('/chat', function (req, res) {
  var stream = fs.createReadStream("/Users/fisher/Downloads/office.pkg");
  res.setHeader('Content-Length' , 1821908233); 
  stream.pipe(res);
});