
const util = require('util');
const MISSING_POINT = null;
class CircularRenderBuffer{
    constructor(window_size){
      
        this.window_data=[];
        this.current_pointer=0;
        this.window_size=window_size;
        this.gap_space = Math.floor(window_size*5/100)+1; // gap space is around 5% of full screen
     
        // null all ==> discontinue point
        for(let i=0;i<window_size;i++){
            this.window_data.push(MISSING_POINT);
        }
    }
    incr_pointer(){
        let is_over = false; // number step over the window size in this update
        let pos = this.current_pointer+1;
        this.current_pointer = pos%(this.window_size);
        if(pos >= this.window_size){
            is_over=true;
        }
        return is_over;        
    }
    insert_and_rotate_shift(new_data){ // shift data with gap to separate two window frame
      
        let window_data= this.window_data;
        let gap_num = this.gap_space;
        let cpos = this.current_pointer; 
        window_data[cpos]= new_data;
        for(let i=0;i<gap_num;i++){
            let p =cpos+i+1;
            if(p>=this.window_size) break;
            window_data[p]=MISSING_POINT;
        }
        this.incr_pointer();
    }
    get_buffer(){
        return this.window_data;
    }
}

let a=[0,1,2,3,4,5,6,7,8,9];

let cbuff = new CircularRenderBuffer(20);

for (let i=0; i <30;i++){
    cbuff.insert_and_rotate_shift(i);
    let data = cbuff.get_buffer();
    console.log(`step: ${i} dat = ${util.inspect(data)}`);
}


