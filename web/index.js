


var TICKINTERVAL = 86400000
let XAXISRANGE = 777600000
let chart;
var socket = io();
const { fromEvent, Observable, of, interval } = rxjs;
const { map, mergeMap, delay, bufferTime, concatAll, concatMap } = rxjs.operators;
let wd_size = 200;
let slide_speed=2;
let pool_data = [];

let window_data = [];


let t_render = 100;
const observable = fromEvent(socket, 'newmsg');
observable.pipe(
    mergeMap(json => JSON.parse(json)),// flatmap 
    concatMap(x => of(x).pipe(delay(20))),//delay each element in 20ms
    //bufferTime(100),//buffer untill 100ms then emit the array
).subscribe((msg) => {
    //console.log('--->event new msg'+ new Date().getTime() +JSON.stringify(msg));
    pool_data.push(msg);
});

let render_dat = [];


function shift_one(window_size = wd_size) {
    // move 1 point
    let dat = pool_data.shift();
    window_data = [...window_data, dat];
    if (window_data.length > window_size) {
        window_data.shift();
    }
}

function shift_n(speed_n,window_size = wd_size) {
    // move 1 point
    let dat = pool_data.splice(0,speed_n);
    window_data.splice(0,speed_n);
    window_data = [...window_data, ...dat];
   
}


function slide_window_render(speed=2,window_size) {
    let lead_num = pool_data.length;

    if (chart) {
        if (lead_num > 0) {

            if (window_data.length < window_size) {
                shift_one(window_size);// move 1 point
                //shift_n(speed)
            } else { // full window

                let dist = lead_num - window_size + 1;
                if (dist <= window_size) {                    
                    shift_n(speed);
                } else {
                    dist = window_data.length / 3;
          
                    shift_n(Math.floor(dist));

                }
            }
            // chart.setData(window_data);
            chart.updateSeries([{
                data: window_data
            }])
        }


    }

}



function period_render(t_render) {
    setTimeout(async () => {
        slide_window_render(slide_speed,wd_size);
        console.log(`${new Date().getTime()} render_time: ${t_render}, window_sz:${window_data.length} ,pool_buffer: ${pool_data.length}`);
        period_render(t_render);
    }, t_render);
}
period_render(t_render)




window.onload = () => {
    const el = document.getElementById('chart');
    var options = {
        series: [{
            data: []
        }],
        chart: {
            id: 'realtime',
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 1,
        },
        title: {
            text: 'ApexChart realtime',
            align: 'left'
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            range: undefined,
        },
        yaxis: {
            max: 100
        },
        legend: {
            show: false
        },
        grid: {
            show: true,
            borderColor: '#90A4AE',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
                lines: {
                    show: true
                }
            },   
            yaxis: {
                lines: {
                    show: true
                }
            },  
            row: {
                colors: undefined,
                opacity: 0.5
            },  
            column: {
                colors: undefined,
                opacity: 0.5
            },  
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },  
        }
        
    };

    chart = new ApexCharts(el, options);
    chart.render();

}


// socket.on('newmsg', function (records) {
//     try {
//         let arr = JSON.parse(records);
  
//         if(chart){
//             buff = [...buff,...arr];
//         }
//     } catch (error) {

//     }

// })