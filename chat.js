(function() {
    var  socket  =  io('/chat');
    $("form").submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit("request", $("#message").val());
        $("#message").val("");
    return  true;
});
socket.on('io message', function(msg){

    $('#messages').append($('<li>').text(msg.message));
    $('#messages').append($('<span>').text(msg.author));

  });
})();