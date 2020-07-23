
let chart;
let socket = io();
let Tr = 80;
let Ts_default=100;
let ts = 50;
let Tbuff = 4000;
let Nbuff = Math.floor(Tbuff/ts) + 1 ;
let NPoolMax=2*Nbuff;
let cpool_buff = new RingBuffer(NPoolMax);

let window_size = 100;
let cbuff = new CircularRenderBuffer(window_size);
let x_val = [];
for (let i = 0; i < window_size; i++) {
    x_val[i] = i;
}

let sample_time=ts;

let poller = new TimeoutPoller(Tr);

let log={};
socket.on('disconnect', function () {
    console.log('reconnect ')
    socket = io();
    // reconnect
});
socket.on('newmsg', function (json) {
    try {
        let json_data = JSON.parse(json);
        Ts_default = json_data.ts;
        
        Nbuff = Tbuff/Ts_default;

        let jdat= json_data.data;

        for (let i = 0; i < jdat.length; i++) {
            cpool_buff.push(jdat[i].y);
        }

        let dat_len = jdat.length;
        if(dat_len>1){
            sample_time = (jdat[dat_len - 1].x - jdat[0].x) / (dat_len-1);
            sample_time = Math.floor(sample_time * 1000);
            //sample_time = sample_time < 20 ? 20 : sample_time;
            //sample_time = sample_time > 100 ? 100 : sample_time;
            log.sample_time=sample_time;
        }
     
    } catch (error) {
        console.log(error);
    }
})

/**
 * cpool_buff : pool_buff of input data
 * 
 */

function calc_number_of_rendered_sample(cpool_buff,Tr,sample_time,Tbuff=4000){
    let theory_pop = Math.floor(Tr/sample_time)+1;
    let Nmin = Math.floor(Tbuff/sample_time)+1;
    let pool_length =cpool_buff.get_size();
    let d = (pool_length-Nmin);
    d = (d>1)?d:1; //  d >= 1 
    d = Math.min(theory_pop,d);
    log.npop_vs_theory=`${d}/${theory_pop}`;
    return d;
}



async function cbuff_window_render(cbuff) {
    let lead_num = cpool_buff.get_size();
    log.npool_vs_Nbuff = `${lead_num} / ${Nbuff}`;

    if (chart) {
        if (lead_num > 0) {

            let dist = calc_number_of_rendered_sample(cpool_buff,Tr,sample_time,Tbuff);
            let data = cpool_buff.pop(dist);
            cbuff.insert_and_rotate_shift(data);
            let y_buff = cbuff.get_buffer();
            let render_buff = [x_val, y_buff];     
            let cc = await chart.setData(render_buff);
        }
    }

}


async function exec_render() {
  
    cbuff_window_render(cbuff);
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
                value: (u, v) => v == null ? "-" : v.toFixed(2)*ts + "ms", // x lengend display
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
                values: (u, vals, space) => vals.map(v => +v.toFixed(1) * Ts_default + "ms"), //x_axis display grid
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


    let t = new Date().getTime();
    document.getElementById('btnStop').onclick = ()=>{
        if(poller.is_stop){

            poller.updatePeriod(Tr);
            poller.startPoll(async () => {
                let t1 = new Date().getTime();
                await exec_render();
                let dt =(t1 - t);
                log.t_render =dt;
                let str ={...log};
               // let str = `loop_time=${(t1 - t)}ms vs fps:${Math.floor(1000 / poller.period)}, wid_sz:${cbuff.window_data.length}, pbuffer:${cpool_buff.get_size()}, ts:${sample_time}ms`;
                console.log(str);
                document.getElementById('text').innerHTML = JSON.stringify(log);
                t = t1;
            })
            document.getElementById('btnStop').innerHTML="Click Here To Stop";


        }else{
            poller.stopPoll();
            document.getElementById('btnStop').innerHTML="Click Here To Start";

        }
       
    };

}