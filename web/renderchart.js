var socket = io();
let tr = 200;
let wd_size=100;
let pool_data =[];
let window_data=[];

const { fromEvent, Observable, of, interval } = rxjs;
const { map, mergeMap, delay, bufferTime, concatAll, concatMap } = rxjs.operators;

const observable = fromEvent(socket, 'newmsg');
observable.pipe(
    mergeMap(json => JSON.parse(json)),// flatmap 
    concatMap(x => of(x).pipe(delay(20))),//delay each element in 20ms
    //bufferTime(100),//buffer untill 100ms then emit the array
).subscribe((msg) => {
    //console.log('--->event new msg'+ new Date().getTime() +JSON.stringify(msg));
    pool_data.push(msg);
});


function slide_window_render(window_size, max_T_render = 150, min_T_render = 20) {
    let lead_num = pool_data.length;
    let slide_speed = max_T_render;

    if (chart) {
        if (lead_num > 0) {

            //slide_speed = Math.floor(max_T_render / lead_num);
            //slide_speed = slide_speed > min_T_render ? slide_speed : min_T_render;
            
            // slide_speed = 20*(lead_num-window_size);
            // slide_speed =slide_speed > min_T_render ? slide_speed : min_T_render;
            // slide_speed =slide_speed > max_T_render ? max_T_render : slide_speed;

            let dt = (10-lead_num);
            slide_speed = 5*(dt);
                slide_speed =slide_speed > min_T_render ? slide_speed : min_T_render;
            slide_speed =slide_speed > max_T_render ? max_T_render : slide_speed;
            // slide the window
            let dat = pool_data.shift();
            window_data = [...window_data, dat];
            if (window_data.length > window_size) {
                window_data.shift();
            }
            chart.updateSeries([{
                data: window_data
            }])
        }

       
    }
    return slide_speed;
}



function period_render(t_render){
    setTimeout(async()=>{
        let tr = slide_window_render(wd_size);
        console.log(`${new Date().getTime()} t_render : ${tr}, lead_num: ${pool_data.length}`);
        period_render(tr);
    },t_render);
}
period_render(tr);
