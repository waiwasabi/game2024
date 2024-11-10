'use client'
import React, { useState, useRef } from "react";
import PixelRow from "./PixelRow";
import "../styles/DrawingPad.css";

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

export default function DrawingPad(props: DrawingPadProps) {
    const { width, height, baseColor} = props;
  
    const panelRef = useRef(null);

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

        <div>
            <button onClick={() => {setRows(arr.map(row => row.map(val => baseColor)))}} className="button">
                Reset
            </button>
        </div>
      </div>
    );
  }