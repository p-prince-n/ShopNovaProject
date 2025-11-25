
import { Button, Tooltip } from "flowbite-react";
import City from "../../assets/images/CityAnimated.png";

export function CityToltip({openCityProduct, HandleDataSubmit}) {
  return (
    <Tooltip content="City">
      <button onClick={()=>{openCityProduct(true); HandleDataSubmit()}}>
        <img
            src={City}
            alt="SunCloud"
            className="w-full h-full object-contain rounded-full"
          />
      </button>
    </Tooltip>
  );
}
