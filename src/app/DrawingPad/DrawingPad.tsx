'use client'
import React, { useState, useRef } from "react";
import PixelRow from "./PixelRow";
import "../styles/DrawingPad.css";
import { exportComponentAsPNG } from "react-component-export-image";

enum Color {
    WHITE = 1,
    RED,
    BROWN,
}

interface DrawingPadProps {
    width: number,
    height: number,
    baseColor: Color
}

interface Coord {
    "x": number,
    "y": number
}

interface ObjectsJSON {
    "player": Coord[],
    "platforms": Coord[],
    "portal": Coord[],
}

// Width_Mult represents the multiplier for the width (per pixel)
// Height_Mult represents the multiplier for the height (per pixel)
function createJSON(colorRows: Color[][], width: number, height: number, width_mult: number, height_mult: number): ObjectsJSON {

    const output: ObjectsJSON = {"player": [], "platforms": [], "portal": []};

    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            const curr = {"x": column * width_mult, "y": row * height_mult};
            switch(colorRows[row][column]) {
                case Color.WHITE:
                    output["player"].push(curr);
                    break;
                case Color.RED:
                    output["platforms"].push(curr);
                    break;
                case Color.BROWN:
                    output["portal"].push(curr);
                    break;
            }
        }
    }

    return output;
}

export default function DrawingPad(props: DrawingPadProps) {
    const { width, height, baseColor} = props;
  
    const panelRef = useRef<HTMLDivElement>(null);

    let count = 0;

    const colorRows: Color[][] = [];

    for (let y = 0; y < height; y++) {
        const curr = [];
        for (let x = 0; x < width; x++) curr.push(baseColor);
        colorRows.push(curr);
    }

    const [arr, setRows] = useState(colorRows);
    const [paletteColor, setPaletteColor] = useState(Color.RED);

  
    return (
      <div id="drawingPad">
        <div className="picker">
            <button className="roundButtonRed" onClick={() => setPaletteColor(Color.RED)}/>
            <button className="roundButtonBrown" onClick={() => setPaletteColor(Color.BROWN)}/>
            <button className="roundButtonWhite" onClick={() => setPaletteColor(Color.WHITE)}/>
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

            <button onClick={() => exportComponentAsPNG(panelRef)} className="button">
              Export as PNG
            </button>
        </div>
      </div>
    );
  }