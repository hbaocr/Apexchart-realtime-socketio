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
            
        }else{
           // console.log(`can not start Poller. ${this.is_stop}`)
        }
    }

    stopPoll(){
        this.is_stop=true;
        this.period=0;
    }
}
