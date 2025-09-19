
import { Button, Tooltip } from "flowbite-react";
import SunCloud from "../../assets/images/SunCloud.png";

export function ToltipExample({openWeatherProduct, HandleDataSubmit}) {
  return (
    <Tooltip content="Weather">
      <button onClick={()=>{openWeatherProduct(true); HandleDataSubmit()}}>
        <img
            src={SunCloud}
            alt="SunCloud"
            className="w-full h-full object-contain"
          />
      </button>
    </Tooltip>
  );
}
