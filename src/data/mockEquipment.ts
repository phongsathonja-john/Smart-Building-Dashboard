import type { Equipment } from "../models/equipment";


export const mockEquipment: Equipment[] = [

{
id:"CH-01",
name:"CH-01",
type:"CHILLER",
status:"RUN",

power:134.4,
capacity:134.4,

supplyTemp:7.2,
returnTemp:12.1,

flow:410,

alarm:0,

lastUpdate:"2026-09-24 15:00"
},


{
id:"CH-02",
name:"CH-02",
type:"CHILLER",
status:"RUN",

power:128.7,
capacity:128.7,

supplyTemp:7.4,
returnTemp:12.3,

flow:405,

alarm:0,

lastUpdate:"2026-09-24 15:00"
},


{
id:"AHU-01",
name:"AHU-01",
type:"AHU",
status:"RUN",

power:3.2,
capacity:3.2,

supplyTemp:14.8,
returnTemp:24.2,

alarm:0,

setTemperature:24,

controlMode:"AUTO",

lastUpdate:"2026-09-24 15:00"
},


{
id:"AHU-02",
name:"AHU-02",
type:"AHU",
status:"RUN",

power:3.5,
capacity:3.5,

supplyTemp:15.2,
returnTemp:23.9,

alarm:0,

setTemperature:24,

controlMode:"AUTO",

lastUpdate:"2026-09-24 15:00"
},


{
id:"AHU-03",
name:"AHU-03",
type:"AHU",
status:"RUN",

power:3.8,
capacity:3.8,

supplyTemp:14.7,
returnTemp:24.6,

alarm:0,

setTemperature:24,

controlMode:"AUTO",

lastUpdate:"2026-09-24 15:00"
},


{
id:"P-CHW-01",
name:"P-CHW-01",
type:"PUMP",
status:"RUN",

power:18.4,
capacity:18.4,

flow:405,

alarm:0,

lastUpdate:"2026-09-24 15:00"
},


{
id:"P-CHW-02",
name:"P-CHW-02",
type:"PUMP",
status:"STOP",

power:0,
capacity:0,

flow:0,

alarm:0,

lastUpdate:"2026-09-24 15:00"
}

];