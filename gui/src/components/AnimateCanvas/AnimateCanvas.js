import React, { Component } from "react";

class AnimateCanvas extends Component {

    render() {
        return (
            <canvas id={this.props.id} style={{position: "absolute", width: "100%", minHeight: "calc(100% - 143px);"}}></canvas>
        );
    }
}

export default AnimateCanvas;

