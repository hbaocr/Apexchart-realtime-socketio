let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');

let express = require('express');

let app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);

// edit signal here
let interval =2000; // time in ms to emmit data buff  to chart
let fs = 20;//20hz ==> 50ms : sampling rate of signal
//

let sin_f =10;// signal character



let ts_ms = 1000*1/fs;

let cnt = interval/ts_ms;

let buffer =[];
let socket_sav ;
let t=new Date().getTime();
function calc_dt(){
    let t1=new Date().getTime();
    let dt= t1-t;
    t=t1;
    return dt;
    
}
setInterval(()=>{
    let utc = new Date().getTime() / 1000;
    let xdata=utc;
    let f2 = Math.random()*50;
    let ydata = 50*Math.sin(2*sin_f*Math.PI*1/fs*xdata);//+ 50*Math.sin(2*f2*Math.PI*1/fs*xdata);
    buffer.push({x:xdata, y:ydata});
    if(buffer.length>cnt){ // make sure in interval 2 sec emit 1 msg of array
        if(socket_sav){
            let msg = JSON.stringify(buffer);
            socket_sav.emit('newmsg', msg);
            console.log(`dt: ${calc_dt()/1000}sec | buff len: ${buffer.length} | sampling time : ${ts_ms}`);
            buffer =[];
        } 
    }

},ts_ms);




io.on('connection', function(socket) {
    console.log('A user connected');
    socket_sav=socket;
});



app.use(bodyParser.json());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + '/web'));//mount root of web to 'web'
app.use(morgan('dev'));
let app_port =8000;
let app_bind_ip ="0.0.0.0";
// app.listen(app_port, app_bind_ip, function () {
//     console.log('Example app listening on ' + app_bind_ip + ':' + app_port);
// });
http.listen(app_port, app_bind_ip, function () {
    console.log('Example app listening on ' + app_bind_ip + ':' + app_port);
});
