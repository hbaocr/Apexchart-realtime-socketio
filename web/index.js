


var TICKINTERVAL = 86400000
let XAXISRANGE = 777600000
let chart;
let socket = io();
let sample_time = 100;
let window_size=600;
let t_render = 50;
let move_speed=2;
let pool_data=[];
let cbuff = new CircularRenderBuffer(window_size);
let x_val=[];
for(let i=0;i<window_size;i++){
    x_val[i]=i;
}
socket.on('disconnect', function(){
    console.log('reconnect ')
    socket=io();
    // reconnect
 });
socket.on('newmsg', function (json) {
    try {
        let jdat = JSON.parse(json);
        for(let i=0;i<jdat.length;i++) {
            pool_data.push(jdat[i].y);
        }
       
        let dat_len = jdat.length;
        sample_time = (jdat[dat_len-1].x-jdat[0].x) /dat_len;
        sample_time = Math.floor(sample_time*1000);
        sample_time = sample_time <20?20:sample_time;
        sample_time = sample_time >100?100:sample_time;
       // console.log(`sampling time ${sample_time} ms`);

    } catch (error) {
        console.log(error);
    }
})




async function cbuff_window_render(cbuff) {
    let lead_num = pool_data.length;
    let window_size = cbuff.window_size;
    if (chart) {
        if (lead_num > 0) {

                // let dist = lead_num - window_size + 1;
                // if (dist <= window_size) { 
                //     let data = pool_data.splice(0,speed);
                //     cbuff.insert_and_rotate_shift(data);
                // } else {
                    dist = Math.floor(window_size / 3);
                    dist=1;
                    let data = pool_data.splice(0,dist);
                    cbuff.insert_and_rotate_shift(data);
               // }
    
            let y_buff= cbuff.get_buffer();
            let render_buff =[x_val,y_buff];
            let ttt = new Date().getTime();
            let cc=await chart.setData(render_buff);
            //cc.catch(console.log);
            ttt=new Date().getTime()-ttt;
            console.error(`----->measure updateSeries func = ${ttt}ms at buffsize ${render_buff[0].length}`);

        }
    }

}






let t = new Date().getTime();

function period_render(t_render) {
    setTimeout(async () => {
        cbuff_window_render(cbuff,move_speed);
        let t1 = new Date().getTime();
       console.log(`loop_interval=${(t1-t)} render_time: ${t_render}, window_sz:${cbuff.window_data.length} ,pool_buffer: ${pool_data.length}, sampling time ${sample_time} ms`);
       t=t1;
        period_render(sample_time);
    }, t_render);
}
period_render(t_render)




window.onload = () => {
    //const el = document.getElementById('chart');
    let opts = {
        title: "My Chart",
        id: "chart",
        class: "my-chart",
        width: 800,
        height: 600,
        scales: {
            x: {
                time: false,// treat as number
            },
        },

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

    chart = new uPlot(opts, [], document.body);
}