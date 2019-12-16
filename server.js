// very important, never put events inside oether ones, only if you are obliged, this may cause same event emitted many times. 
// Every event sould be standalone. 


const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var randomstring = require("randomstring");
server.listen(8080);

const ioFile = io.of('/file'); //namespace
const ioChat = io.of('/chat');


var route="";
var size="";



app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/chat.html');
});

app.get('/fileTransfer', function (req, res) {
  res.sendFile(__dirname + '/fileTransfer.html');
});




// io for chat
ioChat.on('connection', function (socket) {

  console.log("nouveau client connecté CHAT");

  socket.on('disconnect', function(socket){
    console.log("un client deconnecté");
  });

  socket.on('chat message', function (messageSent) {

    ioChat.emit("io message", {message : messageSent, author : "someOne" })
    
});
});
// io for chat




// io for file
ioFile.on('connection' , function (socket){

  console.log("nouveau clientFile connecté");

  socket.on('lookPath' , function(path){

      console.log("client want: "+path);

      ioFile.emit('askwork', path);
      console.log("demande au bot");
  });

  socket.on('readyWork', function (data){
    console.log("bot sent: \n"+data);

    if(data.type === "Directory"){
      // hundle directory response
      ioFile.emit('response' , data);
    }else if(data.type === "notFound"){
      ioFile.emit('response' , data);

    }else if(data.type === "File"){

      console.log("demande du fichier au bot");
      ioFile.emit('getFile', data.path );
      route = "/"+ randomstring.generate(7); // generate random string
      size=data.size;
      ioFile.emit('response', { info : data, link : route } );

    }
  }); 


  ss(socket).on('fileStream', function(stream, fileName){
    console.log("stream recu: :"+ stream);
    
    app.get(route , function (req, res){
      console.log("route speciale");
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      res.setHeader('Content-Length' , size); 
      stream.pipe(res);
      route="";
      size="";
    });
  });


  socket.on('disconnect', function(socket){
    console.log("un clientFile deconnecté");
  });

}); // io for file

app.use(express.static(__dirname)); // pouvoir utiliser src= " "....repertoire du projet



// const receiveData = 
//   {type : "directory || file" , path : "directory/path" ,
//    content : [ 
//       {subType : "directory || file1" , name : "any" , path : "anyPath1", size : "18 ko" },
//       {subType : "directory || file2" , name : "any" , path : "anyPath2" , size : "18 ko" },
//       {subType : "directory || file3" , name : "any" , path : "anyPath3", size : "18 ko"  },

//    ]
//   }


