import React, { Component } from "react";
import "./AnimateCanvas.css";

class AnimateCanvas extends Component {
    render() {
        return (
            <canvas className={"canvas-body"} id={this.props.id} style={{
                position: "absolute",
                width: "100%",
                height: "calc(100% - 143px)"
            }}> </canvas>
        );
    }
}

export default AnimateCanvas;

