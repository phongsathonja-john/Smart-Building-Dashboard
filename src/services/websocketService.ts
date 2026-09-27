import type { Equipment } from "../models/equipment";
import {
  generateRealtimeUpdate
} from "./mockRealtime";


type Callback = (
  equipment: Partial<Equipment> & {
    id:string
  }
)=>void;


class WebSocketService {

  private timer:number | undefined;

  connect(
    equipments:Equipment[],
    callback:Callback
  ){

    this.timer = window.setInterval(()=>{

      const randomEquipment =
        equipments[
          Math.floor(
            Math.random()*equipments.length
          )
        ];


      const update =
        generateRealtimeUpdate(
          randomEquipment
        );


      callback({
        id:randomEquipment.id,
        ...update
      });


    },5000);


  }


  disconnect(){

    if(this.timer){

      clearInterval(this.timer);

      this.timer = undefined;

    }

  }

}


export const websocketService =
new WebSocketService();