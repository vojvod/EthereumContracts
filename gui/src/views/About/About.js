import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import "../../assets/vendor/fontawesome-free/css/all.min.css";
import "../../assets/vendor/simple-line-icons/css/simple-line-icons.css";
import "../../assets/device-mockups/device-mockups.min.css";
import "../../assets/css/new-age.css";

class About extends Component {
    constructor() {
        super();
        this.state = {files: []}
    }


    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <div id="page-top">
                                <section className="features" id="features" style={{padding: 0, margin: 0}}>
                                    <div className="container">
                                        <div className="section-heading text-center" style={{padding: 0, margin: 0}}>
                                            <h2>Unlimited Features, Unlimited Fun</h2>
                                            <p className="text-muted">Check out what you can do with this app theme!</p>
                                            <hr/>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-1 my-auto"></div>
                                            <div className="col-lg-10 my-auto">
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <i className="pe-7s-id"> </i>
                                                                <h3>File Details</h3>
                                                                <p className="text-muted">Ready to use HTML/CSS device
                                                                    mockups, no Photoshop required!</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <i className="pe-7s-mail-open-file"> </i>
                                                                <h3>Add New File</h3>
                                                                <p className="text-muted">Put an image, video,
                                                                    animation, or anything else in the screen!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <i className="pe-7s-add-user"> </i>
                                                                <h3>Add Owner</h3>
                                                                <p className="text-muted">As always, this theme is free
                                                                    to download and use for any purpose!</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="feature-item"
                                                                 style={{paddingTop: 0, paddingBottom: 10}}>
                                                                <i className="pe-7s-delete-user"> </i>
                                                                <h3>Remove Owner</h3>
                                                                <p className="text-muted">Since this theme is MIT
                                                                    licensed, you can use it commercially!</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-1 my-auto"></div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default About;
