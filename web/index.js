

var data = []
var TICKINTERVAL = 86400000
let XAXISRANGE = 777600000

let chart;
var socket = io();
function shift(arr, direction, n) {
    var times = n > arr.length ? n % arr.length : n;
    return arr.concat(arr.splice(0, (direction > 0 ? arr.length - times : times)));
 }

function render_chart(new_dat) {
    try {

        if (chart) {
            data = [...data, ...new_dat];
            chart.updateSeries([{
                data: data
            }])
        }
    } catch (error) {

    }
}


function render_chart_window(new_dat,window_size) {
    try {

        if (chart) {
            data = [...data, ...new_dat];
            if(data.length>window_size){
                //let rm = data.length - window_size;
               // data = shift(data,0,rm);
               data.shift();
            }
            chart.updateSeries([{
                data: data
            }])
        }
    } catch (error) {

    }
}



const { fromEvent, Observable, of, interval } = rxjs;
const { map, mergeMap, delay, bufferTime, concatAll,concatMap } = rxjs.operators;

const observable = fromEvent(socket, 'newmsg');
observable.pipe(
    mergeMap(json => JSON.parse(json)),// flatmap 
    concatMap(x=>of(x).pipe(delay(40))),//delay each element in 20ms
    //bufferTime(100),//buffer untill 100ms then emit the array
).subscribe((msg) => {
    console.log(new Date().getTime()+ '  |  ' +msg);
    //render_chart([msg]);
    render_chart_window([msg],200);
});






window.onload = () => {
    const el = document.getElementById('chart');
    var options = {
        series: [{
            data: data.slice()
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