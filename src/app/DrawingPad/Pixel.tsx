import React, { useState } from "react";
import "../styles/Pixel.css";

enum Color {
    WHITE = 1,
    RED,
    BROWN,
}

interface PixelProps {
    handleClick: (_: number) => void,
    paletteColor: Color,
    color: Color,
    column: number,
}

function Pixel(props: PixelProps) {
    const {handleClick, paletteColor, color, column} = props;

    let currColor = color;
    const [pixelColor, setColor] = useState(color);

    function mouseEnter() {
        if (currColor !== paletteColor) setColor(paletteColor);
    }

    function mouseLeave() {
        if (currColor !== paletteColor) setColor(currColor);
    }

    function getColor() {
        switch(pixelColor) {
            case Color.WHITE:
                return "#ffffff";
            case Color.RED:
                return "#ff0000";
            case Color.BROWN:
                return "rgb(107, 59, 24)";
        }
    }

    return (
        <div
          className="pixel"
          onClick={() => {currColor = paletteColor; handleClick(column);}}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          style={{ backgroundColor: getColor() }}
        ></div>
      );
}

export default React.memo(Pixel);