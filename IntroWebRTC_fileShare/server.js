// const express = require('express'); 
// let app = express();
// let server = require('http').Server(app);
// const port = 3999 ;

const express = require('express'); // using express 
const socketIO = require('socket.io');
const http = require('http')
const port = 3999 // setting the port  
let app = express();
let server = http.createServer(app)
let io = socketIO(server);
console.log('server started at port : localhost: ' + port);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index.ejs');
});

io.on('connection', socket => {
    socket.on('ready', function (req) {
        socket.join(req.chat_room);
        socket.join(req.signal_room);
        socket.join(req.file_room);
        io.to(req).emit('announce', {
            message: "New Client in the " + req + 'room'
        });
    });
    socket.on('send',function(req){
        console.log("Send Message event")
        io.to(req.chat_room).emit('message',{
            message:req.message,
            author:req.author
        });
    });
    socket.on('signal',function(req){
        socket.broadcast.to(req.room).emit('signaling_message',{
            message:req.message,
            type:req.type
        });
    });
    socket.on('files',function(req){
        socket.broadcast.to(req.room).emit('files',{
            filename: req.filename,
            filesize: req.filesize
        });
    });
})

server.listen(port);