
function set_periode(interval=1000){
    setInterval(() => {
        console.log(new Date().getTime());
    }, interval);
}
let a= new set_periode();
a();
setTimeout(() => {
    console.log('dete');
    delete a;
},5000)




// function findPeaks(arr) {
//     var peak;
//     var idx;
//     return arr.reduce(function(peaks, val, i) {
//       if (arr[i+1] > arr[i]) {
//         peak = arr[i+1];
//         idx = i+1;
//       } else if ((arr[i+1] < arr[i]) && (typeof peak === 'number')) {
//         peaks.push({peak,idx});
//         peak = undefined;
//       }
//       return peaks;
//     }, []);
//   }
  
//   let json = ["monitoring",{"ts":{"blood_pressure":0,"body_temperature":0,"heart_rate":1000,"pi":1000,"pleth":20,"spo2":1000},"hwId":272885080348601,"sendDate":1595148851645,"data":{"heart_rate":{"startTime":1595148851642,"endTime":1595148851642,"value":84},"oxygen_saturation":{"dateTime":1595148851642,"spo2":99,"pi":7,"pleth":[{"dateTime":1595148849900,"value":33},{"dateTime":1595148849924,"value":31},{"dateTime":1595148849948,"value":29},{"dateTime":1595148849972,"value":25},{"dateTime":1595148849996,"value":20},{"dateTime":1595148850020,"value":19},{"dateTime":1595148850044,"value":17},{"dateTime":1595148850068,"value":16},{"dateTime":1595148850092,"value":16},{"dateTime":1595148850116,"value":15},{"dateTime":1595148850140,"value":14},{"dateTime":1595148850164,"value":13},{"dateTime":1595148850188,"value":14},{"dateTime":1595148850212,"value":27},{"dateTime":1595148850236,"value":68},{"dateTime":1595148850260,"value":117},{"dateTime":1595148850284,"value":142},{"dateTime":1595148850308,"value":148},{"dateTime":1595148850332,"value":130},{"dateTime":1595148850356,"value":90},{"dateTime":1595148850380,"value":81},{"dateTime":1595148850404,"value":73},{"dateTime":1595148850428,"value":60},{"dateTime":1595148850452,"value":54},{"dateTime":1595148850476,"value":64},{"dateTime":1595148850500,"value":77},{"dateTime":1595148850524,"value":90},{"dateTime":1595148850548,"value":97},{"dateTime":1595148850572,"value":93},{"dateTime":1595148850596,"value":83},{"dateTime":1595148850620,"value":63},{"dateTime":1595148850644,"value":35},{"dateTime":1595148850668,"value":12},{"dateTime":1595148850692,"value":0},{"dateTime":1595148850716,"value":0},{"dateTime":1595148850740,"value":0},{"dateTime":1595148850764,"value":0},{"dateTime":1595148850788,"value":0},{"dateTime":1595148850812,"value":0},{"dateTime":1595148850836,"value":0},{"dateTime":1595148850860,"value":0},{"dateTime":1595148850884,"value":0},{"dateTime":1595148850908,"value":0},{"dateTime":1595148850932,"value":0},{"dateTime":1595148850956,"value":0},{"dateTime":1595148850980,"value":0},{"dateTime":1595148851004,"value":0},{"dateTime":1595148851028,"value":0},{"dateTime":1595148851052,"value":0},{"dateTime":1595148851076,"value":0},{"dateTime":1595148851100,"value":0},{"dateTime":1595148851124,"value":0},{"dateTime":1595148851148,"value":0},{"dateTime":1595148851172,"value":26},{"dateTime":1595148851196,"value":61},{"dateTime":1595148851220,"value":84},{"dateTime":1595148851244,"value":92},{"dateTime":1595148851268,"value":81},{"dateTime":1595148851292,"value":60},{"dateTime":1595148851316,"value":48}]}}}]
  
//   //console.log(json);
//   let arr = json[1].data.oxygen_saturation.pleth.map(x=>x.value);
//   console.log(arr);
//   let peak =findPeaks(arr);
//   console.log(peak);


// class ParseData {
//     doParse(json) {
//         let schema = [this.blood_pressure, this.heart_rate, this.oxygen_saturation, this.body_temperature];
//         let jdata = json[1].data;
//         let data = [];
//         schema.forEach((key) => {
//             let keydata = this.parser[key](jdata);
//             if (keydata) {
//                 Object.keys(keydata).forEach((key) => {
//                     data[key] = keydata[key];
//                 })
//             }
//         });
//         data[this.hwId] = json[1][this.hwId];
//         data[this.sendDate] = json[1][this.sendDate];
//         data[this.ts] = json[1][this.ts];
//         return data;
//     }

//     constructor() {
//         this.parser = [];
//         this.hwId = 'hwId';
//         this.ts = 'ts';
//         this.sendDate = 'sendDate';
//         this.heart_rate = 'heart_rate';
//         this.oxygen_saturation = 'oxygen_saturation';
//         this.spo2 = "spo2";
//         this.pi = "pi";
//         this.pleth = "pleth";
//         this.blood_pressure = "blood_pressure";
//         this.systolic = "systolic";
//         this.diastolic = "diastolic";
//         this.body_temperature = "body_temperature";


//         function normalize_data(value, time) {
//             return {
//                 value: value,
//                 dateTime: time
//             }
//         }

        
//         //heart rate parser
//         this.parser[this.heart_rate] = (json_obj) => {
//             let json = json_obj[this.heart_rate];
//             let data = [];
//             if (json) {
//                 let value = json.value;
//                 let time = Math.floor((json.startTime + json.endTime) / 2);
//                 data[this.heart_rate] = [normalize_data(value, time)];
//             }

//             return data;

//         };
//         //oxygen_saturation parser
//         this.parser[this.oxygen_saturation] = (json_obj) => {
//             let json = json_obj[this.oxygen_saturation];
//             let data = [];
//             if (json) {
//                 data[this.spo2] = [normalize_data(json.spo2, json.dateTime)];
//                 if (json.pi) {
//                     data[this.pi] = [normalize_data(json.pi, json.dateTime)];
//                 }
//                 if (json.pleth && Array.isArray(json.pleth)) {
//                     if ((json.pleth.length > 0)) {
//                         data[this.pleth] = json.pleth.map(v => normalize_data(v.value, v.dateTime));
//                     }
//                 }
//             }

//             return data;
//         };

//         //blood_pressure parser
//         this.parser[this.blood_pressure] = (json_obj) => {
//             let json = json_obj[this.blood_pressure];
//             let data = [];
//             if (json) {
//                 data[this.systolic] = [normalize_data(json.systolic, json.dateTime)];
//                 data[this.diastolic] = [normalize_data(json.diastolic, json.dateTime)];
//             }
//             return data;
//         };
//         //body_temperature parser
//         this.parser[this.body_temperature] = (json_obj) => {
//             let data = [];
//             let json = json_obj[this.body_temperature];
//             if (json) {
//                 data[this.body_temperature] = [normalize_data(json.value, json.dateTime)];
//             }
//             return data;
//         };
//     }

// }

// let json = `["monitoring",{"hwId":238557556886085,"sendDate":1595149382379,"data":{"blood_pressure":{"dateTime":1595149319390,"systolic":143,"diastolic":83},"body_temperature":{"dateTime":1595149319390,"value":36.2},"heart_rate":{"startTime":1595149319390,"endTime":1595149382371,"value":89},"oxygen_saturation":{"dateTime":1595149319390,"spo2":98,"pleth":[]}}}]`;
// let jsonobj = JSON.parse(json);
// let parser = new ParseData();
// let r = parser.doParse(jsonobj)
// console.log(r);

// json = `["monitoring",{"ts":{"blood_pressure":0,"body_temperature":0,"heart_rate":1000,"pi":1000,"pleth":20,"spo2":1000},"hwId":272885080348601,"sendDate":1595148851645,"data":{"heart_rate":{"startTime":1595148851642,"endTime":1595148851642,"value":84},"oxygen_saturation":{"dateTime":1595148851642,"spo2":99,"pi":7,"pleth":[{"dateTime":1595148849900,"value":33},{"dateTime":1595148849924,"value":31},{"dateTime":1595148849948,"value":29},{"dateTime":1595148849972,"value":25},{"dateTime":1595148849996,"value":20},{"dateTime":1595148850020,"value":19},{"dateTime":1595148850044,"value":17},{"dateTime":1595148850068,"value":16},{"dateTime":1595148850092,"value":16},{"dateTime":1595148850116,"value":15},{"dateTime":1595148850140,"value":14},{"dateTime":1595148850164,"value":13},{"dateTime":1595148850188,"value":14},{"dateTime":1595148850212,"value":27},{"dateTime":1595148850236,"value":68},{"dateTime":1595148850260,"value":117},{"dateTime":1595148850284,"value":142},{"dateTime":1595148850308,"value":148},{"dateTime":1595148850332,"value":130},{"dateTime":1595148850356,"value":90},{"dateTime":1595148850380,"value":81},{"dateTime":1595148850404,"value":73},{"dateTime":1595148850428,"value":60},{"dateTime":1595148850452,"value":54},{"dateTime":1595148850476,"value":64},{"dateTime":1595148850500,"value":77},{"dateTime":1595148850524,"value":90},{"dateTime":1595148850548,"value":97},{"dateTime":1595148850572,"value":93},{"dateTime":1595148850596,"value":83},{"dateTime":1595148850620,"value":63},{"dateTime":1595148850644,"value":35},{"dateTime":1595148850668,"value":12},{"dateTime":1595148850692,"value":0},{"dateTime":1595148850716,"value":0},{"dateTime":1595148850740,"value":0},{"dateTime":1595148850764,"value":0},{"dateTime":1595148850788,"value":0},{"dateTime":1595148850812,"value":0},{"dateTime":1595148850836,"value":0},{"dateTime":1595148850860,"value":0},{"dateTime":1595148850884,"value":0},{"dateTime":1595148850908,"value":0},{"dateTime":1595148850932,"value":0},{"dateTime":1595148850956,"value":0},{"dateTime":1595148850980,"value":0},{"dateTime":1595148851004,"value":0},{"dateTime":1595148851028,"value":0},{"dateTime":1595148851052,"value":0},{"dateTime":1595148851076,"value":0},{"dateTime":1595148851100,"value":0},{"dateTime":1595148851124,"value":0},{"dateTime":1595148851148,"value":0},{"dateTime":1595148851172,"value":26},{"dateTime":1595148851196,"value":61},{"dateTime":1595148851220,"value":84},{"dateTime":1595148851244,"value":92},{"dateTime":1595148851268,"value":81},{"dateTime":1595148851292,"value":60},{"dateTime":1595148851316,"value":48}]}}}]`

// jsonobj = JSON.parse(json);

// r = parser.doParse(jsonobj)
// console.log(r);

