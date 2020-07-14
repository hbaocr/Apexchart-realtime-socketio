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
function build_render_data(window_dat) {
    render_dat = [];
    render_dat[0] = [];//x
    render_dat[1] = [];//y

    window_dat.map((data) => {
        render_dat[0].push(data.x);
        render_dat[1].push(data.y);
    })
}

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

            build_render_data(window_data);
            chart.setData(render_dat);
        }


    }

}



function period_render(t_render) {
    setTimeout(async () => {
        slide_window_render(slide_speed,wd_size);
        console.log(`${new Date().getTime()} t_render : ${t_render}, window_size:${window_data.length} ,lead_num: ${pool_data.length}`);
        period_render(t_render);
    }, t_render);
}
period_render(t_render);



// let data = [
//     [1546300800, 1546387200],    // x-values (timestamps)
//     [35, 71],    // y-values (series 1)
// ];

let data = [];

window.onload = () => {
    //const el = document.getElementById('chart');
    let opts = {
        title: "My Chart",
        id: "chart",
        class: "my-chart",
        width: 800,
        height: 600,
        series: [
            {},
            {
                // initial toggled state (optional)
                show: true,

                spanGaps: false,

                // in-legend display
                label: "Y_value",
                // value: (u, v) => v == null ? "-" : v.toFixed(2) + " MB",
                stroke: "green",
            }
        ],
        axes: [
            {},
            {
                scale: '',
                values: (u, vals, space) => vals.map(v => +v.toFixed(1) + ""),
            },
        ],
    };

    chart = new uPlot(opts, data, document.body);
}


