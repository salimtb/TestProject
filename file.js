

(function() {
    var  socket  =  io('/file');
    $("form").submit(function(e) {
        $("#messages").empty(); // remove previous messages
        e.preventDefault(); // prevents page reloading
        socket.emit('lookPath', $("#message").val());
        $("#message").val("");
    return  true;
});


socket.on('response', function(data){

    $("#messages").empty(); // remove previous messages
    console.log(data);

    if( typeof(data.path) === "undefined"){
        $('#messages').append($('<h3>').text("Current Directory : "+data.info.path)); // to download stream
    }else{
        $('#messages').append($('<h3>').text("Current Directory : "+data.path));
    }

    
    let order = 0;
    if(data.type === "Directory"){

            data.content.forEach(element => {
                $('#messages').append($('<li id=' +order+'>').text(element.name));
                $('#messages').append($('<span>').text(element.subType + "  size: "+ Math.trunc(element.size ) +" Ko"));
                order ++;
            });


            $('li').click(function(event){    
                var id = event.target.id; // fetch the id of element <il> that was clicked
                console.log('id = ' + id); 
                
                if (data.content[id].path !== "/"){
                    let pathSearch = data.content[id].path+"/"+data.content[id].name; 
                    console.log(pathSearch);
                    socket.emit('lookPath',  pathSearch);
                }else{
                    let pathSearch = data.content[id].path+data.content[id].name; 
                    console.log(pathSearch);
                    socket.emit('lookPath',  pathSearch);
                }
            });

    }else {

        console.log("file.js $"+ data.info.path);
        $('#messages').append('<li> <a href= "'+ data.link +'" >' + data.info.path + '</a></li>');
        $('#messages').append($('<span>').text(data.info.type + "  size: "+ Math.trunc(data.info.size / 1024) +" Ko"));
    } // handle file 
        

    });
})();