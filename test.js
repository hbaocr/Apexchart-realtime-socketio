
const util = require('util');
const MISSING_POINT = null;
class RingBuffer{
    constructor(size=1000,init_val=null){
        this.size=size;
        this.buff=[];
        for(let i=0;i<this.size;i++){
            this.buff[i]=init_val;
        }
        this.tail=0;
        this.head=0;
    }
    _pop(){
        let v= this.buff[this.tail];
        this.tail= (this.tail+1)%this.size;
        return v;
    }
    get_size(){
        let d= this.head-this.tail;
        d= (d>=0)?d:(this.size+d)
        return d;
    }
    push(new_data){
        this.buff[this.head]=new_data;
        this.head= (this.head+1)%this.size;
    }
    pop(n=1){
        let res=[];
        let l = Math.min(this.get_size(),n);
        for(let i=0;i<l;i++){
            let v = this._pop();
            res.push(v);
        }
        return res;
    }
    reset(init_val=null){
        for(let i=0;i<this.size;i++){
            this.buff[i]=init_val;
        }
        this.tail=0;
        this.head=0;
    }
}

let aa = new RingBuffer(5);
for(let i=0;i<9;i++){
    aa.push(i);
    console.log(...aa.buff);
}
