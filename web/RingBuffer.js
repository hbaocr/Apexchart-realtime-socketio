class RingBuffer{
    constructor(size=1000,init_val=null){
        this.size=size;
        this.buff=[];
        for(let i=0;i<this.size;i++){
            this.buff[i]=init_val;
        }
        this.tail=0;
        this.head=0;
        this.over_cnt=0;
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
    get_over_count(){
        return this.over_cnt;
    }
    push(new_data){
        this.buff[this.head]=new_data;
        this.head= (this.head+1)%this.size;
        if(this.head==this.tail){
            this.over_cnt=this.over_cnt+1;
        }
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
        this.over_cnt=0;
    }

}