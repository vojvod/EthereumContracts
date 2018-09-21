import React, { Component } from "react";

class TopInfo extends Component {

    render() {
        return (
            <div style={{textAlign: "center", backgroundColor: "#fde073", padding: "0px 15px"}}>
                {this.props.msg}
            </div>
        );
    }
}

export default TopInfo;
