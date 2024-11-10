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
    row: number,
    handleClick: (row: number, column: number) => void,
}

function PixelRow(props: PixelRowProps) {
    const {colors, paletteColor, handleClick, row} = props;
  
    return (
        <div className="row">
            {colors.map((color, _) => 
            <Pixel
                key={"row: " + row + " column: " + _ + " color: " + color} 
                paletteColor={paletteColor} 
                color={color}
                handleClick={(_) => handleClick(row, _)}
                column={_}
            />)}
        </div>
    );
  }

  export default React.memo(PixelRow);