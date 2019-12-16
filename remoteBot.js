var host = 'http://192.168.1.22:8080/file';
const socket = require ('socket.io-client')(host);
const ss = require('socket.io-stream');
const fs = require('fs');
const path = require('path');

var data = {};

function processPath(currentPath) 
{
    fs.stat(currentPath, function(err, stats){
        if (!err){
            if (stats.isFile()){
                data.type = "File";
                data.path = currentPath;
                data.size = (Math.floor(stats.size) ) ;

                return data;
            }else {
                    data.type = "Directory";
                    data.path = currentPath;
                    data.size = (Math.floor(stats.size / 1024) );

                    data.content = new Array();
                    fs.readdir(currentPath, function(err, items) {
                        let i = 0;
                        if(typeof items === 'undefined'){return }; // possible crash if items === undefined
                        items.forEach(element => {
                            let type="";
                            
                            fs.stat(currentPath+"/"+element, function(err, stats){
                                if (stats.isFile()){
                                    type = "File";
                                }else{ type = "Directory"; }

                                data.content[i] = 
                                {
                                    subType : type,
                                    name : element,
                                    path : currentPath,
                                    size :  (Math.floor(stats.size / 1024) ) ,
                                } ; 

                                i++; 
                            });
                            
                        });
                    
                    }); return data; 
                }
            }else{
                data.type = 'notFound' ,
                data.path = 'Not found';
            }
        }); 
    }



// check if path is a correct argument, can cause bot crash
socket.on('connect', function(id){
    console.log("bot connecté");
    socket.on('askwork', function(path){

        console.log("path to precess: "+path);
        processPath(path);
        // wait 30 millisecondes to get data processed
        var x = setTimeout(f, 50);
        
        function f(){
            socket.emit('readyWork', data);
            console.log(data);
            data = {}; // clear data global variable
            console.log(data);
        }
    });
});


socket.on('getFile', function(filePath){
    var stream = ss.createStream();
    console.log("path du fichier: "+filePath);
    ss(socket).emit('fileStream', stream , path.basename(filePath) );
    fs.createReadStream(filePath).pipe(stream);
});


// socket.on('getFile', function(filePath){
//     console.log("path du fichier: "+filePath);
//     processFile(filePath);
// });


// async function processFile(filePath){
//     var stream = ss.createStream();
//         console.log("path du fichier: "+filePath);
//         ss(socket).emit('fileStream', stream , path.basename(filePath) );
//         fs.createReadStream(filePath, {highWaterMark : 800024}).pipe(stream);
// }

// async function processFile(filePath) {
//     var stream = ss.createStream();
//     ss(socket).emit('fileStream', stream , path.basename(filePath) );
//     console.log("path du fichier: "+filePath);
//     const readStream = fs.createReadStream(filePath,
//     { highWaterMark: 1024 });

//     for await (const chunk of readStream) {
//     //   chunk.pipe(stream);
//     stream.write(chunk , function (){
//         console.log("chunck written: "+ path.basename(filePath));
//     });
//     }
//     stream.end();
//     console.log('### DONE ###');
// }

    




// const receiveData = 
//   {type : "directory || file" , path : "directory/path" ,
//    content : [ 
//       {subType : "directory || file1" , name : "any" , path : "anyPath1", size : "18 ko" },
//       {subType : "directory || file2" , name : "any" , path : "anyPath2" , size : "18 ko" },
//       {subType : "directory || file3" , name : "any" , path : "anyPath3", size : "18 ko"  },

//    ]
//   }