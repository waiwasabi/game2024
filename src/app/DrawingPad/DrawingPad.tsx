'use client'
import React, { useState, useRef } from "react";
import PixelRow from "./PixelRow";
import "../styles/DrawingPad.css";
import html2canvas from 'html2canvas';
import * as fs from 'fs';

enum Color {
    WHITE = 1,
    RED,
    BROWN,
    YELLOW,
}

interface Coord {
    "x": number,
    "y": number
}

interface ObjectsJSON {
    "player": Coord,
    "platforms": Coord[],
    "portal": Coord,
}

interface DrawingPadProps {
    width: number,
    height: number,
    baseColor: Color,
    updateJSON: (input: ObjectsJSON) => void,
}

// Width_Mult represents the multiplier for the width (per pixel)
// Height_Mult represents the multiplier for the height (per pixel)
function createJSON(colorRows: Color[][], width: number, height: number, width_mult: number, height_mult: number, updateJSON: (input: ObjectsJSON) => void): void {

    const output: ObjectsJSON = {
        "player": {"x": 0, "y": (height - 1) * height_mult}, 
        "platforms": [], 
        "portal": {"x": (width - 1) * width_mult, "y": (height - 1) * height_mult}, 
    };

    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            const curr = {"x": column * width_mult, "y": row * height_mult};
            switch(colorRows[row][column]) {
                case Color.RED:
                    output["player"] = curr;
                    break;
                case Color.BROWN:
                    output["platforms"].push(curr);
                    break;
                case Color.YELLOW:
                    output["portal"] = curr;
                    break;
            }
        }
    }

    /*
    const fs = require('fs');
    const jsonData = JSON.stringify(output, null, 2);
    fs.writeFileSync('public/pixels.json', jsonData);
    */
    console.log(output);
    updateJSON(output);
}

export default function DrawingPad(props: DrawingPadProps) {
    const { width, height, baseColor, updateJSON} = props;
  
    const panelRef = useRef(null);

    let count = 0;

    const colorRows: Color[][] = [];

    for (let y = 0; y < height; y++) {
        const curr = [];
        for (let x = 0; x < width; x++) curr.push(baseColor);
        colorRows.push(curr);
    }

    const exportAsPNG = () => {
        if (panelRef.current) {
          html2canvas(panelRef.current).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'component.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          });
        }
      };

    const [arr, setRows] = useState(colorRows);
    const [paletteColor, setPaletteColor] = useState(Color.RED);

  
    return (
      <div id="drawingPad">
        <div className="picker">
            <button className="roundButtonRed" onClick={() => setPaletteColor(Color.RED)}/>
            <button className="roundButtonBrown" onClick={() => setPaletteColor(Color.BROWN)}/>
            <button className="roundButtonWhite" onClick={() => setPaletteColor(Color.WHITE)}/>
            <button className="roundButtonYellow" onClick={() => setPaletteColor(Color.YELLOW)}/>
        </div>

        <div id="pixels" ref={panelRef}>
            {arr.map((colors, row) => 
            <PixelRow
                colors={colors} 
                paletteColor={paletteColor} 
                row={row}
                key={"row: " + row + " color: " + count}
                handleClick={(row_ind, column_ind) => 
                    {setRows(arr.map((row, ind1) => row.map((val, ind2) => (row_ind === ind1 && column_ind === ind2) ? paletteColor : val)));}}
            />
            )}
        </div>

        <div className="picker">
            <button onClick={() => {setRows(arr.map(row => row.map(val => baseColor)))}} className="button">
                Reset
            </button>

            <button onClick={exportAsPNG} className="button">
              Export as PNG
            </button>

            <button onClick={() => createJSON(arr, width, height, 20, 20, updateJSON)} className="button">
              Add Objects
            </button>
        </div>
      </div>
    );
  }