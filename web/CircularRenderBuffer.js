const MISSING_POINT = null;
class CircularRenderBuffer{
    constructor(window_size){
      
        this.window_data=[];
        this.current_pointer=0;
        this.window_size=window_size>5?window_size:5;
        this.gap_space = Math.floor(window_size*2/100)+1; // gap space is around 2% of full screen
     
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

    _insert_one_data(new_data){ // shift data with gap to separate two window frame
    
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

    insert_and_rotate_shift(dat){
        if(Array.isArray(dat)){ //array insert
            for(let i=0;i<dat.length;i++){
                this._insert_one_data(dat[i]);
            }
        }else{ // number insert
            this._insert_one_data(dat);
        }
    }


    get_buffer(){
        return this.window_data;
    }
}