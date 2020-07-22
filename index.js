let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');

let express = require('express');

let app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);

// edit signal here
let interval =1000; // time in ms to emmit data buff  to chart
let fs = 20;//20hz ==> 50ms : sampling rate of signal
//

let sin_f =1;// signal character



let ts_ms = 1000*1/fs;

let cnt = interval/ts_ms;

let buffer =[];
let socket_sav ;


let xdata=0;
let t=new Date().getTime();
setInterval(()=>{
    //let utc = new Date().getTime() / 1000;
   

     xdata=xdata+1;
     t = xdata/fs;
 
    let ydata = 50*Math.sin(2*Math.PI*sin_f*t);//+ 50*Math.sin(2*f2*Math.PI*1/fs*xdata);
    buffer.push({x:t, y:ydata});
    if(buffer.length>cnt){ // make sure in interval 2 sec emit 1 msg of array
       

        if(socket_sav){
            let t1=new Date().getTime();

            let emit_data ={
                data:buffer,
                ts : ts_ms
            }

            let msg = JSON.stringify(emit_data);

            socket_sav.emit('newmsg', msg);
            let dt = (buffer[buffer.length-1].x -buffer[0].x)/(buffer.length -1);
            console.log(`dt: ${t1/1000}sec | buff len: ${buffer.length} | sampling time : ${ts_ms} | ${1000*dt}`);
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
