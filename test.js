
// const util = require('util');
// const MISSING_POINT = null;
// class RingBuffer{
//     constructor(size=1000,init_val=null){
//         this.size=size;
//         this.buff=[];
//         for(let i=0;i<this.size;i++){
//             this.buff[i]=init_val;
//         }
//         this.tail=0;
//         this.head=0;
//     }
//     _pop(){
//         let v= this.buff[this.tail];
//         this.tail= (this.tail+1)%this.size;
//         return v;
//     }
//     get_size(){
//         let d= this.head-this.tail;
//         d= (d>=0)?d:(this.size+d)
//         return d;
//     }
//     push(new_data){
//         this.buff[this.head]=new_data;
//         this.head= (this.head+1)%this.size;
//     }
//     pop(n=1){
//         let res=[];
//         let l = Math.min(this.get_size(),n);
//         for(let i=0;i<l;i++){
//             let v = this._pop();
//             res.push(v);
//         }
//         return res;
//     }
//     reset(init_val=null){
//         for(let i=0;i<this.size;i++){
//             this.buff[i]=init_val;
//         }
//         this.tail=0;
//         this.head=0;
//     }
// }

// let aa = new RingBuffer(5);
// for(let i=0;i<9;i++){
//     aa.push(i);
//     console.log(...aa.buff);
// }

class TimeoutPoller{
    constructor(period){
        this.period=period;
        this.is_stop=true;
        this.startPoll=this.startPoll.bind(this);
        this.stopPoll = this.stopPoll.bind(this);
        this.updatePeriod=this.updatePeriod.bind(this);
        this.handleLoop=this.handleLoop.bind(this);
    }
    updatePeriod(period){
        this.period=period;
    }
    handleLoop(fc_exec){
        if((!this.is_stop)&&(this.period>1)){
            setTimeout(async () => {
                if(fc_exec){
                    await fc_exec();
                }else{
                    this.is_stop=false;
                }
                this.handleLoop(fc_exec);
            },this.period);
        }
    }
    startPoll(fn_exe){
        if((fn_exe)&&(this.is_stop)&&(this.period>1)){
            this.is_stop=false;
            this.handleLoop(fn_exe);
            
        }
    }

    stopPoll(){
        this.is_stop=true;
        this.period=0;
    }
}

let pp = new TimeoutPoller(100);
let i=0;
pp.startPoll(()=>{
    console.log(pp.period,'loop at' , i++);
})

setInterval(()=>{
    pp.updatePeriod(Math.floor(1000*Math.random()));
},1000)

setTimeout(()=>{
    pp.stopPoll();
},10000);
