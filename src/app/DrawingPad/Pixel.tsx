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
    key: string,
    column: number,
}

export default function Pixel(props: PixelProps) {
    const {handleClick, paletteColor, color, key, column} = props;

    const [pixelColor, setColor] = useState(props.color);

    function mouseEnter() {
        if (pixelColor !== paletteColor) setColor(paletteColor);
    }

    function mouseLeave() {
        setColor(color);
    }

    function getColor() {
        switch(pixelColor) {
            case Color.WHITE:
                return "#ffffff";
            case Color.RED:
                return "#ff0000";
            case Color.BROWN:
                return "#964b00";
        }
    }

    return (
        <div
          className="pixel"
          onClick={() => {console.log("clicked!"); handleClick(column);}}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          style={{ backgroundColor: getColor() }}
          key={key}
        ></div>
      );
}