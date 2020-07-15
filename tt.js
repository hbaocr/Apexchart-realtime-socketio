let t = new Date().getTime();
let sample_time=50;
function period_render(t_render) {
    setTimeout(async () => {
        let t1 = new Date().getTime();
       console.log(`interval=${(t1-t)} , sampling time ${sample_time} ms`);
        t= t1;
        period_render(sample_time);
    }, t_render);
}
period_render(sample_time)