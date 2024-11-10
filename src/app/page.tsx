'use client'
import OceanPlatformer from "./game";
import DrawingPad from "./DrawingPad/DrawingPad";
import React, { useState } from "react";

interface Coord {
  "x": number,
  "y": number
}

interface ObjectsJSON {
  "player": Coord,
  "platforms": Coord[],
  "portal": Coord,
}

export default function Home() {
  const init: ObjectsJSON = {
    "player": {"x": 0, "y": 26}, 
    "platforms": [], 
    "portal": {"x": 59, "y": 26}, 
  };

  const [jsonObject, updateJSON] = useState(init);

  return (
    <div>
      <DrawingPad width={60} height={27} baseColor={1} updateJSON={updateJSON}/>
      <OceanPlatformer player={jsonObject.player} platforms={jsonObject.platforms} portal={jsonObject.portal}/>
    </div>
  );
}
