


var TICKINTERVAL = 86400000
let XAXISRANGE = 777600000
let chart;
let socket = io();
let sample_time = 100;
let window_size = 60;
let t_render = 50;
let move_speed = 2;
//let pool_data = [];

let poller = new TimeoutPoller(sample_time);

let cpool_buff = new RingBuffer(1000);
let t_chart_render_ms = 0;
let cbuff = new CircularRenderBuffer(window_size);
let x_val = [];
for (let i = 0; i < window_size; i++) {
    x_val[i] = i;
}
socket.on('disconnect', function () {
    console.log('reconnect ')
    socket = io();
    // reconnect
});
socket.on('newmsg', function (json) {
    try {
        let jdat = JSON.parse(json);
        for (let i = 0; i < jdat.length; i++) {
            //pool_data.push(jdat[i].y);
            cpool_buff.push(jdat[i].y);
        }

        let dat_len = jdat.length;
        sample_time = (jdat[dat_len - 1].x - jdat[0].x) / dat_len;
        sample_time = Math.floor(sample_time * 1000);
        sample_time = sample_time < 20 ? 20 : sample_time;
        sample_time = sample_time > 100 ? 100 : sample_time;
        // console.log(`sampling time ${sample_time} ms`);

    } catch (error) {
        console.log(error);
    }
})


function calc_render_time(sample_time, lead_num, buffer_time = 1000) { //buffer 1 sec
    //calc the render time to make sure there are always having the data in pool_buffer;
    sample_time = sample_time < 20 ? 20 : sample_time;
    let expected_lead_num = Math.floor(buffer_time / sample_time);
    let dn = (lead_num - expected_lead_num) / expected_lead_num;
    dn = dn > 0.5 ? 0.5 : dn;
    dn = dn < -0.5 ? -0.5 : dn;
    return Math.floor(sample_time * (1 - dn));
}

async function cbuff_window_render(cbuff) {
    //let lead_num = pool_data.length;
    let lead_num = cpool_buff.get_size();
    if (chart) {
        if (lead_num > 0) {

            let dist = 1;
            // let data = pool_data.splice(0,dist);
            let data = cpool_buff.pop(dist);
            cbuff.insert_and_rotate_shift(data);
            let y_buff = cbuff.get_buffer();

            let render_buff = [x_val, y_buff];
            let ttt = new Date().getTime();
            let cc = await chart.setData(render_buff);
            //cc.catch(console.log);
            t_chart_render_ms = new Date().getTime() - ttt;
            console.error(`----->measure updateSeries func = ${t_chart_render_ms}ms at buffsize ${render_buff[0].length}`);

        }
    }

}

let t = new Date().getTime();
async function exec_render() {
    let t1 = new Date().getTime();
    cbuff_window_render(cbuff, move_speed);
    let str = `loop_time=${(t1 - t)}ms vs fps:${Math.floor(1000 / t_render)}, chart_render_time:${t_chart_render_ms}ms, wid_sz:${cbuff.window_data.length}, pbuffer:${cpool_buff.get_size()}, ts:${sample_time}ms`;

    console.log(str);
    document.getElementById('text').innerHTML = str;
    t = t1;

}





window.onload = () => {
    //const el = document.getElementById('chart');
    document.getElementById('btnStop').innerHTML="Click Here To Start";
    let opts = {
        // title: "My Chart",
        // id: "chart",
        class: "uPlotChart",
        width: 1200,
        height: 600,
        scales: {
            x: {
                time: false,// treat as number
            },
        },

        series: [
            {
                value: (u, v) => v == null ? "-" : v.toFixed(2) * 50 + "ms", // x lengend display
            },
            {
                // initial toggled state (optional)
                show: true,
                spanGaps: false,

                // in-legend display
                label: "Y_value",
                value: (u, v) => v == null ? "-" : v.toFixed(2) + " MB", // y1 lengend display
                stroke: "green",
            }
        ],
        axes: [
            {
                scale: '',
                values: (u, vals, space) => vals.map(v => +v.toFixed(1) * 50 + "ms"), //x_axis display grid
            },
            {
                scale: '',
                values: (u, vals, space) => vals.map(v => +v.toFixed(2) + "MB"), //y1 display
            },
        ],
    };

    // this auto insert the chart to document.body
    //chart = new uPlot(opts, [], document.body);

    // create opharn dom
    chart = new uPlot(opts, []);
    //append to container <div id ='chart'>
    document.getElementById('chart').appendChild(chart.root);

    document.getElementById('btnStop').onclick = ()=>{
        if(poller.is_stop){

            poller.updatePeriod(sample_time);
            poller.startPoll(async () => {
                await exec_render();
                let t_r = calc_render_time(sample_time, cpool_buff.get_size());
                poller.updatePeriod(t_r);
            })
            document.getElementById('btnStop').innerHTML="Click Here To Stop";


        }else{
            poller.stopPoll();
            document.getElementById('btnStop').innerHTML="Click Here To Start";

        }
       
    };

}