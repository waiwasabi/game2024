import React from "react";
import Pixel from "./Pixel";
import "../styles/PixelRow.css";

enum Color {
    WHITE = 1,
    RED,
    BROWN,
}

interface PixelRowProps {
    colors: Color[],
    paletteColor: Color,
    row: number
    key: string,
    handleClick: (row: number, column: number) => void,
}

export default function PixelRow(props: PixelRowProps) {
    const {colors, paletteColor, handleClick, row} = props;
  
    return (
        <div className="row" key={"row: " + row}>
            {colors.map((color, _) => 
            <Pixel
                key={"row: " + row + " column: " + _} 
                paletteColor={paletteColor} 
                color={color}
                handleClick={(_) => handleClick(row, _)}
                column={_}
            />)}
        </div>
    );
  }