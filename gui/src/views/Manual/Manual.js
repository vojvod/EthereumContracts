import React, {Component} from "react";
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Table} from "react-bootstrap";
import {Card} from "../../components/Card/Card";
import {Translate} from "react-localize-redux";
import './Navigation.css';
import "../../assets/vendor/fontawesome-free/css/all.min.css";
import "../../assets/vendor/simple-line-icons/css/simple-line-icons.css";
import "../../assets/device-mockups/device-mockups.min.css";
import "../../assets/css/new-age.css";

import Img11 from './img/1_1.jpg';
import Img12 from './img/1_2.jpg';
import Img13 from './img/1_3.jpg';
import Img14 from './img/1_4.jpg';

import Img21 from './img/2_1.jpg';
import Img22 from './img/2_2.jpg';
import Img23 from './img/2_3.jpg';

import Img31 from './img/3_1.jpg';
import Img32 from './img/3_2.jpg';

import Img41 from './img/4_1.jpg';
import Img42 from './img/4_2.jpg';
import Img43 from './img/4_3.jpg';
import Img44 from './img/4_4.jpg';
import Img45 from './img/4_5.jpg';

import Img51 from './img/5_1.jpg';
import Img52 from './img/5_2.jpg';
import Img53 from './img/5_3.jpg';
import Img54 from './img/5_4.jpg';
import Img55 from './img/5_5.jpg';
import Img56 from './img/5_6.jpg';

import Img61 from './img/6_1.jpg';
import Img62 from './img/6_2.jpg';
import Img63 from './img/6_3.jpg';
import Img64 from './img/6_4.jpg';
import Img65 from './img/6_5.jpg';
import Img66 from './img/6_6.jpg';

class Manual extends Component {
    constructor() {
        super();

    }

    render() {
        return (

            <div className="content bkimg">
                <Grid fluid>
                    <Row>
                        <Col md={12} xs={12}>
                            <Card
                                title={<b><Translate id="manual.1"/></b>}
                                // category="Please fill out the form below with the new file's owner details"
                                // stats={_this.state.statsLoadFile}
                                // statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <div>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <h5><b><Translate id="manual.intro.blockchain_title"/></b></h5>
                                                <p><Translate id="manual.intro.blockchain_text_1"/></p>
                                                <p><Translate id="manual.intro.blockchain_text_2"/></p>
                                                <img src={Img11} />
                                                <p><Translate id="manual.intro.blockchain_text_3"/></p>
                                                <p><Translate id="manual.intro.blockchain_text_4"/></p>
                                                <p><Translate id="manual.intro.blockchain_text_5"/></p>
                                                <p><Translate id="manual.intro.blockchain_text_6"/></p>
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <h5><b><Translate id="manual.intro.ethereum_title"/></b></h5>
                                                <p><Translate id="manual.intro.ethereum_text_1"/></p>
                                                <p><Translate id="manual.intro.ethereum_text_2"/></p>
                                                <img src={Img12} />
                                                <p><Translate id="manual.intro.ethereum_text_3"/></p>
                                                <p><Translate id="manual.intro.ethereum_text_4"/></p>
                                                <p><Translate id="manual.intro.ethereum_text_5"/></p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <h5><b><Translate id="manual.intro.ipfs_title"/></b></h5>
                                                <p><Translate id="manual.intro.ipfs_text"/></p>
                                                <img src={Img13} />
                                                <h5><Translate id="manual.intro.metamask_title"/></h5>
                                                <p><Translate id="manual.intro.metamask_text"/></p>
                                                <img src={Img14} />
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <h5><b><Translate id="manual.intro.sha256_title"/></b></h5>
                                                <p><Translate id="manual.intro.sha256_text_1"/></p>
                                                <p><Translate id="manual.intro.sha256_text_2"/></p>
                                                <p><Translate id="manual.intro.sha256_text_3"/></p>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} xs={12}>
                            <Card
                                title={<b><Translate id="manual.2"/></b>}
                                // category="Please fill out the form below with the new file's owner details"
                                // stats={_this.state.statsLoadFile}
                                // statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <div>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.description.text_1"/></p>
                                                <p><Translate id="manual.description.text_2"/></p>
                                                <br/>
                                                <img src={Img21} />
                                                <br/>
                                                <p><Translate id="manual.description.text_3"/></p>
                                                <p><Translate id="manual.description.text_4"/></p>
                                                <p><Translate id="manual.description.text_5"/></p>
                                                <br/>
                                                <img src={Img22} />
                                                <br/>
                                                <p><Translate id="manual.description.text_6"/></p>
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.description.text_7"/></p>
                                                <br/>
                                                <img src={Img23} />
                                                <br/>
                                                <p style={{color: "red"}}><Translate id="manual.description.text_8"/></p>
                                                <p><Translate id="manual.description.text_9"/></p>
                                                <p><Translate id="manual.description.text_10"/></p>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} xs={12}>
                            <Card
                                title={<b><Translate id="manual.3"/></b>}
                                // category="Please fill out the form below with the new file's owner details"
                                // stats={_this.state.statsLoadFile}
                                // statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <div>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.details.text_1"/></p>
                                                <p><Translate id="manual.details.text_2"/></p>
                                                <img src={Img31} />
                                                <p><Translate id="manual.details.text_3"/></p>
                                                <p><Translate id="manual.details.text_4"/></p>
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <img src={Img32} />
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} xs={12}>
                            <Card
                                title={<b><Translate id="manual.4"/></b>}
                                // category="Please fill out the form below with the new file's owner details"
                                // stats={_this.state.statsLoadFile}
                                // statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <div>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.addFile.text_1"/></p>
                                                <p><Translate id="manual.addFile.text_2"/></p>
                                                <img src={Img41} />
                                                <p><Translate id="manual.addFile.text_3"/></p>
                                                <p><Translate id="manual.addFile.text_4"/></p>
                                                <img src={Img42} />
                                                <p><Translate id="manual.addFile.text_5"/></p>
                                                <p><Translate id="manual.addFile.text_6"/></p>
                                                <img src={Img43} />
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.addFile.text_7"/></p>
                                                <img src={Img44} />
                                                <img src={Img45} />
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} xs={12}>
                            <Card
                                title={<b><Translate id="manual.5"/></b>}
                                // category="Please fill out the form below with the new file's owner details"
                                // stats={_this.state.statsLoadFile}
                                // statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <div>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.addOwner.text_1"/></p>
                                                <p><Translate id="manual.addOwner.text_2"/></p>
                                                <img src={Img51} />
                                                <p><Translate id="manual.addOwner.text_3"/></p>
                                                <img src={Img52} />
                                                <p><Translate id="manual.addOwner.text_4"/></p>
                                                <img src={Img53} />
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.addOwner.text_5"/></p>
                                                <img src={Img54} />
                                                <p><Translate id="manual.addOwner.text_6"/></p>
                                                <img src={Img55} />
                                                <img src={Img56} />
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} xs={12}>
                            <Card
                                title={<b><Translate id="manual.6"/></b>}
                                // category="Please fill out the form below with the new file's owner details"
                                // stats={_this.state.statsLoadFile}
                                // statsIcon={_this.state.statsIconLoadFile}
                                content={
                                    <div>
                                        <Row>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.removeOwner.text_1"/></p>
                                                <p><Translate id="manual.removeOwner.text_2"/></p>
                                                <img src={Img61} />
                                                <p><Translate id="manual.removeOwner.text_3"/></p>
                                                <img src={Img62} />
                                                <p><Translate id="manual.removeOwner.text_4"/></p>
                                                <img src={Img63} />
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <p><Translate id="manual.removeOwner.text_5"/></p>
                                                <img src={Img64} />
                                                <p><Translate id="manual.removeOwner.text_6"/></p>
                                                <img src={Img65} />
                                                <img src={Img66} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} xs={12}>

                                            </Col>
                                            <Col md={6} xs={12}>

                                            </Col>
                                        </Row>
                                    </div>
                                }
                                legend={
                                    <div className="legend"></div>
                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>


        )
    }
}

export default Manual;
