import type { ReactNode } from "react";
import {
  Plus,
  Minus,
  Power
} from "lucide-react";


interface EquipmentCardProps {

  name:string;

  type:string;

  status:
  | "RUN"
  | "STOP"
  | "FAULT";


  icon:ReactNode;

  value:string;

  unit:string;


  setTemperature?:number;


  onUpdate?:
  (
    data:{
      status:
      | "RUN"
      | "STOP"
      | "FAULT";

      setTemperature:number;
    }
  )=>void;


  onClick:()=>void;

}



export default function EquipmentCard({

  name,

  type,

  status,

  icon,

  value,

  unit,

  setTemperature = 24,

  onUpdate,

  onClick,


}:EquipmentCardProps){



const isAHU =
type === "AHU";




const changeTemperature = (
  amount:number
)=>{


 const newTemp =
 setTemperature + amount;



 if(onUpdate){

   onUpdate({

     status,

     setTemperature:newTemp

   });

 }


};





const togglePower = ()=>{


 if(onUpdate){


  onUpdate({

    status:
      status==="RUN"
      ?
      "STOP"
      :
      "RUN",


    setTemperature


  });


 }


};





return (

<button

className="equipment-card"

onClick={onClick}

>



<div className="equipment-card-top">


<div className="equipment-icon">

{icon}

</div>



<div
className={
`equipment-status ${status.toLowerCase()}`
}
>

<span/>

{status}

</div>


</div>





<div className="equipment-name">

{name}

</div>



<div className="equipment-type">

{type}

</div>





<div className="equipment-value">

{value}

<small>

{unit}

</small>

</div>





{
isAHU && (


<div
className="ahu-control"
onClick={(e)=>e.stopPropagation()}
>


<div className="ahu-temp">


<button

onClick={()=>changeTemperature(-1)}

>

<Minus size={14}/>

</button>



<span>

{setTemperature}°C

</span>



<button

onClick={()=>changeTemperature(1)}

>

<Plus size={14}/>

</button>



</div>





<button

className="ahu-power"

onClick={togglePower}

>

<Power size={14}/>


{

status==="RUN"

?

"OFF AHU"

:

"ON AHU"

}


</button>



</div>


)

}






<div className="equipment-view">

VIEW DETAILS →

</div>



</button>


);


}