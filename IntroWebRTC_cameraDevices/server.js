var express = require('express');
var app = express();
console.log('sercer started');

app.use(express.static(__dirname+'/public'));

app.get('/',function(req,res){
    res.render('index.ejs');
});

app.listen(3999);