const argv = require('optimist')
            .default('db_name','my_base')
            .default('db_port','27017')
            .default('db_ip','localhost')
            .default('serve_ip','localhost')
            .default('serve_port','8080')
            .argv;
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
mongoose.connect('mongodb://'+argv.db_ip+':'+argv.db_port+'/'+argv.db_name, {useNewUrlParser: true,useFindAndModify: false});

//Models
let User = require('./models/User')(mongoose);
let Loteria = require('./models/Loteria')(mongoose);

//Middlewares
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,user,token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//controllers
let UserC = require('./controllers/UserController')(app,User);
let LoteriaC = require('./controllers/LoteriaController')(app,Loteria,User);

//archivos estaticos
app.use('/',express.static('public'));

//run server
server.listen(argv.serve_port,argv.serve_ip,() => {
    console.log("Server corriendo en el puerto: " + argv.serve_port);
});