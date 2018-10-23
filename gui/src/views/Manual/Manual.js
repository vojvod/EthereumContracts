import React, {Component} from "react";
import {Translate} from "react-localize-redux";
import PDFViewer from "mgr-pdf-viewer-react";
import CustomNavigation, {
    CustomPrevButton,
    CustomNextButton,
    CustomPages,
} from './Navigation';
import './Navigation.css';
import {Grid, Row, Col} from "react-bootstrap";
import "../../assets/vendor/fontawesome-free/css/all.min.css";
import "../../assets/vendor/simple-line-icons/css/simple-line-icons.css";
import "../../assets/device-mockups/device-mockups.min.css";
import "../../assets/css/new-age.css";

class Manual extends Component {
    constructor() {
        super();
        this.state = {
            scale: 1.2,
        }
    }

    increaseScale = () => this.setState(({ scale }) => ({ scale: scale + 0.1 }))
    decreaseScale = () => this.setState(({ scale }) => ({ scale: scale - 0.1 }))

    render() {
        return (
            <div className="content bkimg" style={{padding: "10px 15px"}}>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <div id="page-top">
                                {/*<button onClick={this.decreaseScale}>-</button>*/}
                                {/*<span>Scale: {this.state.scale}</span>*/}
                                {/*<button onClick={this.increaseScale}>+</button>*/}
                                <PDFViewer document={{
                                    url: 'https://ipfs.io/ipfs/QmY1Bc3LLsYCTKH36tKEYRpjxm4rgs7zVmRruK2yn2qQdD'
                                }}
                                           scale={this.state.scale}
                                           css="customViewer"
                                           navigation={{
                                               elements: {
                                                   previousPageBtn: CustomPrevButton,
                                                   nextPageBtn: CustomNextButton,
                                                   pages: CustomPages
                                               }
                                           }}/>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default Manual;
