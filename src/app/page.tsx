'use client'
import OceanPlatformer from "./game";
import DrawingPad from "./DrawingPad/DrawingPad";
import React, { useState, useEffect } from "react";

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

      "player": {
          "x": 50,
          "y": 300
      },
      "platforms": [
          {
              "x": 520,
              "y": 260
          },
          {
              "x": 540,
              "y": 260
          },
          {
              "x": 560,
              "y": 260
          },
          {
              "x": 580,
              "y": 260
          },
          {
              "x": 360,
              "y": 300
          },
          {
              "x": 380,
              "y": 300
          },
          {
              "x": 400,
              "y": 300
          },
          {
              "x": 420,
              "y": 300
          },
          {
              "x": 440,
              "y": 300
          },
          {
              "x": 460,
              "y": 300
          },
          {
              "x": 80,
              "y": 340
          },
          {
              "x": 100,
              "y": 340
          },
          {
              "x": 120,
              "y": 340
          },
          {
              "x": 140,
              "y": 340
          },
          {
              "x": 160,
              "y": 340
          },
          {
              "x": 180,
              "y": 340
          },
          {
              "x": 200,
              "y": 340
          },
          {
              "x": 220,
              "y": 340
          },
          {
              "x": 240,
              "y": 340
          },
          {
              "x": 260,
              "y": 340
          }
      ],
      "portal": {
          "x": 640,
          "y": 200
      }
  };

  useEffect(() => {
    const preventScrollKeys = (event: KeyboardEvent) => {
      const keysToPrevent = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];

      if (keysToPrevent.includes(event.key)) {
        event.preventDefault(); // Prevent the default scrolling behavior
      }
    };

    // Add event listener to prevent scrolling for specific keys
    window.addEventListener("keydown", preventScrollKeys);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", preventScrollKeys);
    };
  }, []);

  const [jsonObject, updateJSON] = useState(init);

  return (
    <div>
      <OceanPlatformer player={jsonObject.player} platforms={jsonObject.platforms} portal={jsonObject.portal}/>
      <DrawingPad width={27} height={16} baseColor={1} updateJSON={updateJSON}/>
    </div>
  );
}
